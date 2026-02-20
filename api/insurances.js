// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Swagger spec:
//   host: api-gateway.b7ad-use1.30e5c8e.hsp.philips.com
//   basePath: /v1/insurances/resources
//   path: /api/v2/insurances/catalog
//   Auth: BearerAuth (via Sensedia OAuth2)
//
// Sensedia OAuth2 flow:
//   POST /oauth/access-token
//   Authorization: Basic base64(client_id:client_secret)
//   grant_type=client_credentials

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/insurances/resources';
const ENDPOINT = '/api/v2/insurances/catalog';
const FULL_API_PATH = `${BASE_PATH}${ENDPOINT}`;

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken(clientId, clientSecret) {
    // Retorna token cacheado se válido (com 60s de margem)
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Sensedia usa /oauth/access-token para gerar tokens
    const tokenUrls = [
        `${TASY_HOST}/oauth/access-token`,
        `${TASY_HOST}${BASE_PATH}/oauth/access-token`,
        `${TASY_HOST}/oauth/token`,
    ];

    const errors = [];

    for (const tokenUrl of tokenUrls) {
        console.log(`[OAuth] Trying: ${tokenUrl}`);

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ grant_type: 'client_credentials' }),
            });

            const text = await response.text();
            console.log(`[OAuth] ${tokenUrl} → ${response.status}: ${text.substring(0, 200)}`);

            if (response.ok) {
                try {
                    const data = JSON.parse(text);
                    if (data.access_token) {
                        cachedToken = data.access_token;
                        tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
                        console.log(`[OAuth] SUCCESS with ${tokenUrl}`);
                        return cachedToken;
                    }
                } catch { /* continue */ }
            }

            errors.push(`${tokenUrl} → ${response.status}: ${text.substring(0, 300)}`);
        } catch (e) {
            errors.push(`${tokenUrl} → Error: ${e.message}`);
        }
    }

    throw new Error(`OAuth2 token failed:\n${errors.join('\n')}`);
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
            message: 'Missing TASY_CLIENT_ID or TASY_CLIENT_SECRET env vars.',
        });
    }

    try {
        const token = await getAccessToken(clientId, clientSecret);

        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';
        const apiUrl = `${TASY_HOST}${FULL_API_PATH}${queryString}`;

        console.log(`[API] GET ${apiUrl}`);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log(`[API] → ${apiResponse.status}`);

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
