// api/proxy/[...path].js
// Vercel Serverless Function: Generic Proxy
// This function forwards any incoming request to a backend API defined by the BACKEND_URL environment variable.
// It preserves the HTTP method, query parameters, headers, and body, and returns the backend response
// with appropriate CORS headers.

export default async function handler(req, res) {
    // CORS preflight handling
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.status(200).end();
        return;
    }

    const backendBase = process.env.BACKEND_URL;
    if (!backendBase) {
        console.error('BACKEND_URL environment variable is not set');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.status(500).json({ error: 'Backend URL not configured' });
        return;
    }

    // Extract the dynamic path captured by [...path]
    const { path = [] } = req.query; // Vercel gives an array for catch‑all routes
    const proxyPath = Array.isArray(path) ? path.join('/') : path;

    // Build the full URL to the backend, preserving query string
    const queryString = req.url.split('?')[1] || '';
    const targetUrl = `${backendBase.replace(/\/*$/, '')}/${proxyPath}${queryString ? `?${queryString}` : ''}`;

    // Forward headers (excluding host related headers that may cause issues)
    const forwardedHeaders = { ...req.headers };
    delete forwardedHeaders['host'];
    delete forwardedHeaders['content-length'];

    // Prepare fetch options
    const fetchOptions = {
        method: req.method,
        headers: forwardedHeaders,
        redirect: 'manual',
    };

    // Include body for methods that support it
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = req.body ? JSON.stringify(req.body) : undefined;
        // If the incoming request already has a raw body (e.g., multipart/form-data), preserve it
        if (req.rawBody) {
            fetchOptions.body = req.rawBody;
        }
    }

    try {
        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';
        const responseBody = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        // Forward status code and headers (except hop‑by‑hop headers)
        res.status(response.status);
        response.headers.forEach((value, key) => {
            // Skip any CORS headers from backend to avoid overwriting our own
            if (['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers'].includes(key.toLowerCase())) {
                return;
            }
            if (!['transfer-encoding', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'upgrade'].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        });

        // Set CORS headers on the response back to the frontend (ensure they are present after copying backend headers)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Send the body back in the appropriate format
        if (contentType.includes('application/json')) {
            res.json(responseBody);
        } else {
            res.send(responseBody);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.status(502).json({ error: 'Bad Gateway', details: error.message });
    }
}
