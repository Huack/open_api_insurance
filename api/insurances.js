// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Sensedia requer autenticação OAuth2 (client_credentials):
//   1. Obter access_token via POST /oauth/access-token com Basic auth
//   2. Usar o access_token como Bearer nas chamadas à API
//
// URL = host + basePath + endpoint

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/insurances/resources';
const ENDPOINT = '/api/v2/insurances/catalog';
const FULL_API_PATH = `${BASE_PATH}${ENDPOINT}`;

// Cache do token em memória (reutiliza entre invocações na mesma instância)
let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken(clientId, clientSecret) {
    // Se o token ainda é válido (com margem de 60s), reutiliza
    if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
        return cachedToken;
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Tentar o endpoint OAuth padrão do Sensedia
    const oauthUrl = `${TASY_HOST}/oauth/access-token`;

    console.log(`[AUTH] Requesting access token from ${oauthUrl}`);

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
        console.error(`[AUTH] Token request failed: ${response.status} — ${errorText}`);
        throw new Error(`OAuth token request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // expires_in geralmente vem em segundos
    const expiresIn = data.expires_in || 3600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    console.log(`[AUTH] Token obtained, expires in ${expiresIn}s`);
    return cachedToken;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const clientId = process.env.TASY_CLIENT_ID;
    const clientSecret = process.env.TASY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({
            error: true,
            message: `Missing env vars. TASY_CLIENT_ID: ${!!clientId}, TASY_CLIENT_SECRET: ${!!clientSecret}`,
        });
    }

    try {
        // 1. Obter access token via OAuth
        const accessToken = await getAccessToken(clientId, clientSecret);

        // 2. Chamar a API com o Bearer token
        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';
        const apiUrl = `${TASY_HOST}${FULL_API_PATH}${queryString}`;

        console.log(`[API] GET ${apiUrl}`);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'client_id': clientId,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log(`[API] → ${apiResponse.status}`);

        // Se receber 401, pode ser token expirado — invalida o cache e tenta uma vez mais
        if (apiResponse.status === 401) {
            console.log('[API] 401 received, refreshing token...');
            cachedToken = null;
            const newToken = await getAccessToken(clientId, clientSecret);

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
        console.error('Error:', error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}
