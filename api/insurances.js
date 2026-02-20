// Vercel Serverless Function — Proxy para API Tasy (via Sensedia Gateway)
//
// Sensedia requer DOIS headers para autenticação:
//   1. client_id: header com o ID do app registrado no Sensedia
//   2. Authorization: Bearer {token} obtido na aba "TOKENS DE ACESSO"
//
// URL = host + basePath + endpoint

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
    const token = process.env.TASY_BEARER_TOKEN;

    if (!clientId || !token) {
        return res.status(500).json({
            error: true,
            message: `Missing env vars. TASY_CLIENT_ID: ${!!clientId}, TASY_BEARER_TOKEN: ${!!token}`,
        });
    }

    try {
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
