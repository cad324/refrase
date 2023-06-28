const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Define the API proxy options
const apiProxyOptions = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/', // Replace '/api' with the path you want to proxy
  },
};

// Create the Next.js server with custom request handling
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Proxy API requests
    if (pathname.startsWith('/api')) {
      const apiProxy = createProxyMiddleware(apiProxyOptions);
      apiProxy(req, res);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
