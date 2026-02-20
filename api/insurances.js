// Vercel Serverless Function — OAuth2 + Proxy para API Tasy
const TASY_API_BASE = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';

// Possíveis endpoints OAuth2 para Philips HSP/Tasy
const TOKEN_URLS = [
    `${TASY_API_BASE}/authorize/oauth2/token`,
    `${TASY_API_BASE}/api/api-gateway/v1/token`,
    'https://iam-client-test.us-east.philips-healthsuite.com/oauth2/token',
    'https://iam.us-east.philips-healthsuite.com/oauth2/token',
    `${TASY_API_BASE}/oauth2/token`,
    `${TASY_API_BASE}/auth/realms/master/protocol/openid-connect/token`,
];

let cachedToken = null;
let tokenExpiry = 0;
let workingTokenUrl = null;

async function tryGetToken(url, clientId, clientSecret) {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Tentativa 1: Basic Auth header
    try {
        const r1 = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
                'api-version': '2',
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' }),
        });

        if (r1.ok) {
            const data = await r1.json();
            if (data.access_token) return { ok: true, data, method: 'basic_auth' };
        }
    } catch (e) { /* continue */ }

    // Tentativa 2: Credentials no body
    try {
        const r2 = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'api-version': '2',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (r2.ok) {
            const data = await r2.json();
            if (data.access_token) return { ok: true, data, method: 'body' };
        }

        const text = await r2.text().catch(() => '');
        return { ok: false, status: r2.status, error: text };
    } catch (e) {
        return { ok: false, status: 0, error: e.message };
    }
}

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const clientId = process.env.TASY_CLIENT_ID;
    const clientSecret = process.env.TASY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing TASY_CLIENT_ID or TASY_CLIENT_SECRET env vars.');
    }

    // Se já temos URL que funcionou, usar direto
    if (workingTokenUrl) {
        const result = await tryGetToken(workingTokenUrl, clientId, clientSecret);
        if (result.ok) {
            cachedToken = result.data.access_token;
            tokenExpiry = Date.now() + (result.data.expires_in || 3600) * 1000;
            return cachedToken;
        }
        workingTokenUrl = null;
    }

    const errors = [];
    for (const url of TOKEN_URLS) {
        console.log(`Trying: ${url}`);
        const result = await tryGetToken(url, clientId, clientSecret);
        if (result.ok) {
            console.log(`SUCCESS: ${url} (${result.method})`);
            workingTokenUrl = url;
            cachedToken = result.data.access_token;
            tokenExpiry = Date.now() + (result.data.expires_in || 3600) * 1000;
            return cachedToken;
        }
        errors.push(`${url} → ${result.status}: ${result.error?.substring(0, 200)}`);
    }

    throw new Error(`All OAuth2 endpoints failed:\n${errors.join('\n')}`);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const token = await getAccessToken();

        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';

        // Endpoint correto: /api/v2/insurances/catalog
        const apiUrl = `${TASY_API_BASE}/api/v2/insurances/catalog${queryString}`;
        console.log(`Proxying: ${apiUrl}`);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // 204 = sem resultados
        if (apiResponse.status === 204) {
            return res.status(200).json({ results: [], total: 0 });
        }

        const text = await apiResponse.text();

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: true,
                status: apiResponse.status,
                message: text,
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
