// Vercel Serverless Function — OAuth2 + Proxy para API Tasy
const TASY_BASE = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    // Retorna token cacheado se ainda válido (com 60s de margem)
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const clientId = process.env.TASY_CLIENT_ID;
    const clientSecret = process.env.TASY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error(
            'Missing TASY_CLIENT_ID or TASY_CLIENT_SECRET environment variables. ' +
            `CLIENT_ID present: ${!!clientId}, CLIENT_SECRET present: ${!!clientSecret}`
        );
    }

    // Tentar múltiplos formatos de autenticação OAuth2
    // Formato 1: Basic Auth (mais comum em OAuth2 client_credentials)
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(`${TASY_BASE}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
    });

    const responseText = await response.text();

    if (!response.ok) {
        // Se Basic Auth falhar, tentar com client_id/secret no body
        console.log(`Basic Auth failed (${response.status}): ${responseText}`);
        console.log('Trying with credentials in body...');

        const response2 = await fetch(`${TASY_BASE}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const responseText2 = await response2.text();

        if (!response2.ok) {
            throw new Error(
                `OAuth2 token error. ` +
                `Basic Auth attempt: ${response.status} - ${responseText}. ` +
                `Body credentials attempt: ${response2.status} - ${responseText2}`
            );
        }

        const data2 = JSON.parse(responseText2);
        cachedToken = data2.access_token;
        tokenExpiry = Date.now() + (data2.expires_in || 3600) * 1000;
        return cachedToken;
    }

    const data = JSON.parse(responseText);
    cachedToken = data.access_token;
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
        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';

        const apiUrl = `${TASY_BASE}/v1/insurances/resources${queryString}`;
        console.log(`Proxying to: ${apiUrl}`);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const responseText = await apiResponse.text();
        console.log(`API response status: ${apiResponse.status}`);

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: true,
                status: apiResponse.status,
                message: responseText,
                url: apiUrl,
            });
        }

        try {
            const data = JSON.parse(responseText);
            return res.status(200).json(data);
        } catch {
            return res.status(200).send(responseText);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: true,
            message: error.message || 'Internal server error',
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        });
    }
}
