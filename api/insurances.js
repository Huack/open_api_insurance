// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Sensedia requer DOIS headers para autenticação:
//   1. client_id: header com o ID do app registrado no Sensedia
//   2. Authorization: Bearer {token} obtido na aba "TOKENS DE ACESSO"
//
// Se TASY_BEARER_TOKEN estiver definido, usa ele diretamente.
// Se não, tenta obter um access_token via OAuth2 client_credentials.
//
// URL = host + basePath + endpoint

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/insurances/resources';
const ENDPOINT = '/api/v2/insurances/catalog';
const FULL_API_PATH = `${BASE_PATH}${ENDPOINT}`;

// Cache do token OAuth em memória
let cachedOAuthToken = null;
let tokenExpiresAt = 0;

async function getOAuthToken(clientId, clientSecret) {
    if (cachedOAuthToken && Date.now() < tokenExpiresAt - 60000) {
        return cachedOAuthToken;
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const oauthUrl = `${TASY_HOST}/oauth/access-token`;

    console.log(`[AUTH] Requesting OAuth token from ${oauthUrl}`);

    const response = await fetch(oauthUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AUTH] OAuth failed: ${response.status} — ${errorText}`);
        throw new Error(`OAuth failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    cachedOAuthToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;
    console.log(`[AUTH] OAuth token obtained, expires in ${expiresIn}s`);
    return cachedOAuthToken;
}

async function resolveToken(clientId, clientSecret) {
    // Prioridade 1: Token direto configurado via env var
    const directToken = process.env.TASY_BEARER_TOKEN;
    if (directToken) {
        console.log('[AUTH] Using direct TASY_BEARER_TOKEN');
        return directToken;
    }

    // Prioridade 2: OAuth client_credentials
    if (clientSecret) {
        return await getOAuthToken(clientId, clientSecret);
    }

    throw new Error('No authentication method available. Set TASY_BEARER_TOKEN or TASY_CLIENT_SECRET.');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const clientId = process.env.TASY_CLIENT_ID;
    const clientSecret = process.env.TASY_CLIENT_SECRET;

    if (!clientId) {
        return res.status(500).json({
            error: true,
            message: 'Missing TASY_CLIENT_ID env var.',
        });
    }

    try {
        const token = await resolveToken(clientId, clientSecret);

        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';
        const apiUrl = `${TASY_HOST}${FULL_API_PATH}${queryString}`;

        console.log(`[API] GET ${apiUrl}`);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'client_id': clientId,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log(`[API] → ${apiResponse.status}`);

        // Se 401 e estamos usando OAuth, tenta refresh
        if (apiResponse.status === 401 && !process.env.TASY_BEARER_TOKEN && clientSecret) {
            console.log('[API] 401 — refreshing OAuth token...');
            cachedOAuthToken = null;
            const newToken = await getOAuthToken(clientId, clientSecret);

            const retryResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    'client_id': clientId,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!retryResponse.ok) {
                const text = await retryResponse.text();
                return res.status(retryResponse.status).json({
                    error: true,
                    status: retryResponse.status,
                    message: text,
                    apiUrl,
                });
            }

            const text = await retryResponse.text();
            try {
                return res.status(200).json(JSON.parse(text));
            } catch {
                return res.status(200).send(text);
            }
        }

        if (apiResponse.status === 204) {
            return res.status(200).json({ results: [], total: 0 });
        }

        const text = await apiResponse.text();

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: true,
                status: apiResponse.status,
                message: text,
                apiUrl,
            });
        }

        try {
            return res.status(200).json(JSON.parse(text));
        } catch {
            return res.status(200).send(text);
        }
    } catch (error) {
        console.error('[ERROR]', error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}
