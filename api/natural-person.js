// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Sensedia requer DOIS headers para autenticação:
//   1. client_id: header com o ID do app registrado no Sensedia
//   2. Authorization: Bearer {token} obtido na aba "TOKENS DE ACESSO"
//
// Se TASY_BEARER_TOKEN estiver definido, usa ele diretamente.
// Se não, tenta obter um access_token via OAuth2 client_credentials.

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/natural-person/resources';
const ENDPOINT = '/api/natural-person';
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

    console.log(`[AUTH NP] Requesting OAuth token from ${oauthUrl}`);

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
        console.error(`[AUTH NP] OAuth failed: ${response.status} — ${errorText}`);
        throw new Error(`OAuth failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    cachedOAuthToken = data.access_token;
    const expiresIn = data.expires_in || 3600;
    tokenExpiresAt = Date.now() + expiresIn * 1000;
    console.log(`[AUTH NP] OAuth token obtained, expires in ${expiresIn}s`);
    return cachedOAuthToken;
}

async function resolveToken(clientId, clientSecret) {
    // Prioridade 1: Token direto configurado via env var
    const directToken = process.env.TASY_BEARER_TOKEN;
    if (directToken) {
        console.log('[AUTH NP] Using direct TASY_BEARER_TOKEN');
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, client_id');

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
        // Se a chamada for /api/natural-person/123, precisamos repassar o /123
        // No Vercel, req.url é algo como /api/natural-person?query=1 ou /api/natural-person/123
        const pathname = url.pathname; // ex: /api/natural-person
        // Pegando o que quer que venha depois de /api/natural-person (ex: /123, /123/additional-information)
        const pathSuffix = pathname.replace('/api/natural-person', '');
        const queryString = url.search || '';

        const apiUrl = `${TASY_HOST}${BASE_PATH}${ENDPOINT}${pathSuffix}${queryString}`;

        console.log(`[API NP] ${req.method} ${apiUrl}`);

        const fetchOptions = {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'client_id': clientId,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        // Se for POST ou PUT, repassa o corpo da requisição corretamente
        if (req.method === 'POST' || req.method === 'PUT') {
            fetchOptions.body = JSON.stringify(req.body || {});
        }

        let apiResponse = await fetch(apiUrl, fetchOptions);

        console.log(`[API NP] → ${apiResponse.status}`);

        // Se 401 e estamos usando OAuth, tenta refresh
        if (apiResponse.status === 401 && !process.env.TASY_BEARER_TOKEN && clientSecret) {
            console.log('[API NP] 401 — refreshing OAuth token...');
            cachedOAuthToken = null;
            const newToken = await getOAuthToken(clientId, clientSecret);

            fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
            apiResponse = await fetch(apiUrl, fetchOptions);

            if (!apiResponse.ok) {
                const text = await apiResponse.text();
                return res.status(apiResponse.status).json({
                    error: true,
                    status: apiResponse.status,
                    message: text,
                    apiUrl,
                });
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
        console.error('[ERROR NP]', error);
        return res.status(500).json({
            error: true,
            message: error.message,
        });
    }
}
