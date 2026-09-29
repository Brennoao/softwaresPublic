'use strict';

const fs = require('fs');
const path = require('path');

const { router } = require('./routes');
const db = require('./data');
const { sendJson, sendError, readJsonBody } = require('./utils');
const renderAdminPage = require('./adminPage');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

const CAMPOS_VALIDOS = new Set(['imagemUrl', 'bannerUrl']);
const MIME_PARA_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function encontrarItem(colecao, id) {
  const info = db.COLLECTIONS[colecao];
  if (!info) return { info: null, item: null };
  const item = info.arr.find((x) => String(x[info.idField]) === String(id));
  return { info, item };
}

function validarEntrada(body) {
  const { colecao, id, campo } = body || {};
  if (!colecao || !db.COLLECTIONS[colecao]) return 'Coleção inválida.';
  if (id === undefined || id === null || id === '') return 'Id do item não informado.';
  if (!CAMPOS_VALIDOS.has(campo)) return 'Campo inválido (use imagemUrl ou bannerUrl).';
  return null;
}

// GET /admin — tela pra completar imagens manualmente.
router.get('/admin', (req, res) => {
  const html = renderAdminPage(db.COLLECTIONS);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

// POST /admin/upload — recebe um arquivo (como data URL base64), salva em assets/ e atualiza o JSON.
router.post('/admin/upload', async (req, res) => {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendError(res, err.status || 400, err.message);
  }

  const erroValidacao = validarEntrada(body);
  if (erroValidacao) return sendError(res, 400, erroValidacao);

  const { colecao, id, campo, dataUrl } = body;
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return sendError(res, 400, 'dataUrl ausente ou inválido.');
  }

  const { info, item } = encontrarItem(colecao, id);
  if (!item) return sendError(res, 404, `Item "${id}" não encontrado em "${colecao}".`);

  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/s);
  if (!match) return sendError(res, 400, 'dataUrl com formato inesperado.');
  const [, mime, base64] = match;
  const ext = MIME_PARA_EXT[mime.toLowerCase()];
  if (!ext) return sendError(res, 400, `Tipo de imagem não suportado: ${mime}`);

  let buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch (err) {
    return sendError(res, 400, 'Não foi possível decodificar o arquivo enviado.');
  }
  if (buffer.length === 0) return sendError(res, 400, 'Arquivo vazio.');

  const pastaDestino = path.join(ASSETS_DIR, info.pasta);
  fs.mkdirSync(pastaDestino, { recursive: true });

  const base = slugify(item.nome || `temporada-${item.numero}` || item.id);
  const sufixo = campo === 'bannerUrl' ? '-banner' : '';
  const nomeArquivo = `${base}${sufixo}.${ext}`;
  const destino = path.join(pastaDestino, nomeArquivo);

  try {
    fs.writeFileSync(destino, buffer);
  } catch (err) {
    return sendError(res, 500, `Não foi possível salvar o arquivo: ${err.message}`);
  }

  const urlPublica = `/assets/${info.pasta}/${nomeArquivo}`;
  item[campo] = urlPublica;

  try {
    db.saveCollection(colecao);
  } catch (err) {
    return sendError(res, 500, `Imagem salva, mas não consegui atualizar o JSON: ${err.message}`);
  }

  sendJson(res, 200, { ok: true, url: urlPublica });
});

// POST /admin/set-url — define (ou limpa, se url vazia) o campo direto com uma URL colada.
router.post('/admin/set-url', async (req, res) => {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendError(res, err.status || 400, err.message);
  }

  const erroValidacao = validarEntrada(body);
  if (erroValidacao) return sendError(res, 400, erroValidacao);

  const { colecao, id, campo, url } = body;
  const { item } = encontrarItem(colecao, id);
  if (!item) return sendError(res, 404, `Item "${id}" não encontrado em "${colecao}".`);

  const urlLimpa = typeof url === 'string' ? url.trim() : '';
  if (urlLimpa && !/^https?:\/\//i.test(urlLimpa) && !urlLimpa.startsWith('/assets/')) {
    return sendError(res, 400, 'URL precisa começar com http:// ou https://');
  }

  item[campo] = urlLimpa || null;

  try {
    db.saveCollection(colecao);
  } catch (err) {
    return sendError(res, 500, `Não consegui atualizar o JSON: ${err.message}`);
  }

  sendJson(res, 200, { ok: true, url: item[campo] });
});

module.exports = { ASSETS_DIR };
