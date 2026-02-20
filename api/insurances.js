// Vercel Serverless Function — Proxy para API Tasy
// A API Tasy usa autenticação direta (não OAuth2 token exchange)
const TASY_API_BASE = 'https://api-gateway.b7ad-use1.30e5c8e.hsp.philips.com';
const API_PATH = '/api/v2/insurances/catalog';

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

    const url = new URL(req.url, `https://${req.headers.host}`);
    const queryString = url.search || '';
    const apiUrl = `${TASY_API_BASE}${API_PATH}${queryString}`;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Tentar múltiplos métodos de autenticação
    const authMethods = [
        {
            name: 'Basic Auth',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
        {
            name: 'API Key header (client_id)',
            headers: {
                'x-api-key': clientId,
                'client_id': clientId,
                'client_secret': clientSecret,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
        {
            name: 'Bearer with client_id as token',
            headers: {
                'Authorization': `Bearer ${clientId}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
        {
            name: 'Custom Philips headers',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'api-version': '2',
                'x-client-id': clientId,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
    ];

    const errors = [];

    for (const method of authMethods) {
        console.log(`Trying: ${method.name} → ${apiUrl}`);

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: method.headers,
            });

            const text = await response.text();
            console.log(`${method.name}: status ${response.status}`);

            // Se retornou 200 ou 204, temos sucesso
            if (response.status === 200) {
                try {
                    const data = JSON.parse(text);
                    console.log(`SUCCESS with ${method.name}`);
                    return res.status(200).json(data);
                } catch {
                    return res.status(200).send(text);
                }
            }

            if (response.status === 204) {
                return res.status(200).json({ results: [], total: 0 });
            }

            // 401/403 = auth method wrong, try next
            // 404 = endpoint wrong
            // anything else = also try next
            errors.push({
                method: method.name,
                status: response.status,
                body: text.substring(0, 300),
            });
        } catch (e) {
            errors.push({
                method: method.name,
                status: 0,
                body: e.message,
            });
        }
    }

    // Nenhum método funcionou — retorna erro detalhado para debugging
    return res.status(500).json({
        error: true,
        message: 'All authentication methods failed',
        apiUrl,
        attempts: errors,
    });
}
