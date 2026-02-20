// Vercel Serverless Function — OAuth2 + Proxy para API Tasy
const TASY_BASE = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    // Retorna token cacheado se ainda válido (com 60s de margem)
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const response = await fetch(`${TASY_BASE}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.TASY_CLIENT_ID,
            client_secret: process.env.TASY_CLIENT_SECRET,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`OAuth token error (${response.status}): ${text}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // expires_in geralmente vem em segundos
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedToken;
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const token = await getAccessToken();

        // Montar query string a partir dos params recebidos
        const url = new URL(req.url, `http://${req.headers.host}`);
        const queryString = url.search || '';

        const apiResponse = await fetch(
            `${TASY_BASE}/v1/insurances/resources${queryString}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const contentType = apiResponse.headers.get('content-type') || '';

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).json({
                error: true,
                status: apiResponse.status,
                message: errorText,
            });
        }

        if (contentType.includes('application/json')) {
            const data = await apiResponse.json();
            return res.status(200).json(data);
        } else {
            const text = await apiResponse.text();
            return res.status(200).send(text);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: true,
            message: error.message || 'Internal server error',
        });
    }
}
