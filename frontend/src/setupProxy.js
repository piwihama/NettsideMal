// src/setupProxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.vegvesen.no',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag'
      },
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('SVV-Authorization', 'Apikey e59b5fa7-0331-4359-9c99-bbe1a520db87');
      }
    })
  );
};
