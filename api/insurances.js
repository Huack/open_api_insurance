// Vercel Serverless Function — OAuth2 + Proxy para API Tasy
const TASY_API_BASE = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';

// Philips HSDP IAM OAuth2 endpoints por região
// O gateway "b7ad-use1" indica região US-East
const IAM_TOKEN_URLS = [
    'https://iam-client-test.us-east.philips-healthsuite.com/oauth2/token',
    'https://iam.us-east.philips-healthsuite.com/oauth2/token',
    'https://iam-service.us-east.philips-healthsuite.com/authorize/oauth2/token',
];

let cachedToken = null;
let tokenExpiry = 0;
let workingTokenUrl = null;

async function tryGetToken(url, clientId, clientSecret) {
    // Tentar com Basic Auth
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
            'api-version': '2',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
    });

    if (response.ok) {
        const data = await response.json();
        return { success: true, data, url, method: 'basic_auth' };
    }

    // Se falhou, tentar com credenciais no body
    const response2 = await fetch(url, {
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

    if (response2.ok) {
        const data = await response2.json();
        return { success: true, data, url, method: 'body_credentials' };
    }

    const errorText = await response2.text();
    return {
        success: false,
        status: response2.status,
        error: errorText,
        url,
    };
}

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const clientId = process.env.TASY_CLIENT_ID;
    const clientSecret = process.env.TASY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error(
            'Missing TASY_CLIENT_ID or TASY_CLIENT_SECRET environment variables.'
        );
    }

    // Se já temos um URL que funcionou antes, usar ele primeiro
    if (workingTokenUrl) {
        const result = await tryGetToken(workingTokenUrl, clientId, clientSecret);
        if (result.success) {
            cachedToken = result.data.access_token;
            tokenExpiry = Date.now() + (result.data.expires_in || 3600) * 1000;
            return cachedToken;
        }
        workingTokenUrl = null; // Reset se falhou
    }

    // Tentar cada URL de token
    const errors = [];
    for (const url of IAM_TOKEN_URLS) {
        console.log(`Trying OAuth2 token URL: ${url}`);
        const result = await tryGetToken(url, clientId, clientSecret);

        if (result.success) {
            console.log(`SUCCESS with ${url} (method: ${result.method})`);
            workingTokenUrl = url;
            cachedToken = result.data.access_token;
            tokenExpiry = Date.now() + (result.data.expires_in || 3600) * 1000;
            return cachedToken;
        }

        errors.push(`${url}: ${result.status} - ${result.error}`);
        console.log(`FAILED ${url}: ${result.status}`);
    }

    throw new Error(
        `All OAuth2 token endpoints failed. Attempts:\n${errors.join('\n')}`
    );
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const token = await getAccessToken();

        const url = new URL(req.url, `https://${req.headers.host}`);
        const queryString = url.search || '';

        const apiUrl = `${TASY_API_BASE}/v1/insurances/resources${queryString}`;
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
        console.log(`API response: ${apiResponse.status}`);

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: true,
                status: apiResponse.status,
                message: responseText,
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
        });
    }
}
