// Vercel Serverless Function — Proxy para API Tasy (Philips HSP)
//
// Swagger spec:
//   host: api-gateway.b7ad-use1.30e5c8e.hsp.philips.com
//   basePath: /v1/insurances/resources
//   path: /api/v2/insurances/catalog
//   Full URL = host + basePath + path
//   Auth: BearerAuth (apiKey type, Authorization header)

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/insurances/resources';
const ENDPOINT = '/api/v2/insurances/catalog';
const FULL_API_PATH = `${BASE_PATH}${ENDPOINT}`;

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

    // Montar URL completa: host + basePath + endpoint + queryString
    const url = new URL(req.url, `https://${req.headers.host}`);
    const queryString = url.search || '';
    const apiUrl = `${TASY_HOST}${FULL_API_PATH}${queryString}`;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Swagger diz "BearerAuth" — tentar múltiplas formas de autenticação
    const authAttempts = [
        {
            name: 'Bearer (client_id as token)',
            headers: { 'Authorization': `Bearer ${clientId}` },
        },
        {
            name: 'Bearer (client_secret as token)',
            headers: { 'Authorization': `Bearer ${clientSecret}` },
        },
        {
            name: 'Basic Auth (client_id:client_secret)',
            headers: { 'Authorization': `Basic ${basicAuth}` },
        },
        {
            name: 'API Key (client_id in header)',
            headers: {
                'Authorization': `Bearer ${clientId}`,
                'x-api-key': clientId,
            },
        },
    ];

    const results = [];

    for (const auth of authAttempts) {
        try {
            console.log(`[${auth.name}] GET ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    ...auth.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            const text = await response.text();
            console.log(`[${auth.name}] → ${response.status}`);

            if (response.status === 200) {
                try {
                    const data = JSON.parse(text);
                    console.log(`SUCCESS: ${auth.name}`);
                    return res.status(200).json(data);
                } catch {
                    return res.status(200).send(text);
                }
            }

            if (response.status === 204) {
                return res.status(200).json({ results: [], total: 0 });
            }

            results.push({
                method: auth.name,
                status: response.status,
                body: text.substring(0, 500),
            });
        } catch (e) {
            results.push({
                method: auth.name,
                status: 0,
                body: e.message,
            });
        }
    }

    // Nenhuma tentativa funcionou
    return res.status(500).json({
        error: true,
        message: 'All auth methods failed for the correct API URL.',
        apiUrl,
        note: 'The URL above is built from Swagger: host + basePath + endpoint. If this still returns 404, check the basePath or if the API is accessible from outside the hospital network.',
        attempts: results,
    });
}
