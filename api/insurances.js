// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Auth: Bearer token obtido via Sensedia API Manager
// Swagger: host + basePath(/v1/insurances/resources) + path(/api/v2/insurances/catalog)

const TASY_HOST = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const BASE_PATH = '/v1/insurances/resources';
const ENDPOINT = '/api/v2/insurances/catalog';
const FULL_API_PATH = `${BASE_PATH}${ENDPOINT}`;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const token = process.env.TASY_BEARER_TOKEN;

    if (!token) {
        return res.status(500).json({
            error: true,
            message: 'Missing TASY_BEARER_TOKEN environment variable. Get your token from the Sensedia API Manager "TOKENS DE ACESSO" tab.',
        });
    }

    try {
        // Montar URL completa: host + basePath + endpoint + queryString
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
