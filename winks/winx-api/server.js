'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const { router, ENDPOINTS } = require('./lib/routes');
const { sendError } = require('./lib/utils');
const renderDocsHtml = require('./lib/docsPage');
const { ASSETS_DIR } = require('./lib/adminRoutes'); // registra GET /admin, POST /admin/upload e /admin/set-url

const PORT = process.env.PORT || 3001;

const MIME_POR_EXTENSAO = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/** Serve arquivos estáticos de assets/ em GET /assets/*, com proteção simples contra path traversal. */
function servirAsset(req, res, pathname) {
  const relativo = decodeURIComponent(pathname.replace(/^\/assets\//, ''));
  const destino = path.normalize(path.join(ASSETS_DIR, relativo));
  if (!destino.startsWith(ASSETS_DIR)) {
    return sendError(res, 400, 'Caminho inválido.');
  }
  fs.readFile(destino, (err, conteudo) => {
    if (err) {
      return sendError(res, 404, 'Arquivo não encontrado em assets/.');
    }
    const ext = path.extname(destino).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_POR_EXTENSAO[ext] || 'application/octet-stream',
      'Content-Length': conteudo.length,
      'Cache-Control': 'no-cache',
    });
    res.end(conteudo);
  });
}

// Rota da página inicial (documentação em HTML, amigável no navegador).
router.get('/', (req, res) => {
  const html = renderDocsHtml(ENDPOINTS, PORT);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

const server = http.createServer((req, res) => {
  // CORS liberado para qualquer origem — é uma API pública de dados de fã.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch (err) {
    return sendError(res, 400, 'URL inválida.');
  }

  if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
    return servirAsset(req, res, url.pathname);
  }

  const match = router.match(req.method, url.pathname);

  if (!match) {
    if (router.pathExists(url.pathname)) {
      return sendError(res, 405, `Método ${req.method} não permitido para ${url.pathname}.`);
    }
    return sendError(res, 404, `Rota "${url.pathname}" não encontrada. Veja GET /api para a lista de endpoints.`);
  }

  // Promise.resolve(...).catch cobre tanto handlers síncronos quanto async (ex: os de /admin,
  // que fazem `await readJsonBody(req)`), então um erro em qualquer um dos dois casos vira 500
  // em vez de derrubar o processo ou deixar a requisição pendurada.
  Promise.resolve()
    .then(() => match.handler(req, res, { params: match.params, query: url.searchParams }))
    .catch((err) => {
      console.error('Erro ao processar requisição:', err);
      if (!res.headersSent) sendError(res, 500, 'Erro interno do servidor.');
    });
});

server.listen(PORT, () => {
  console.log(`🧚 Winx Club API rodando em http://localhost:${PORT}`);
  console.log(`   Documentação:      http://localhost:${PORT}/`);
  console.log(`   Lista de endpoints: http://localhost:${PORT}/api`);
});
