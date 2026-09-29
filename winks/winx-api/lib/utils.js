'use strict';

/** Remove acentos e caixa para comparação de busca "fuzzy" simples. */
function normalize(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Verifica se `haystack` contém `needle` (normalizado, ignora acento/caixa). */
function fuzzyIncludes(haystack, needle) {
  if (!needle) return true;
  return normalize(haystack).includes(normalize(needle));
}

/** Busca um texto dentro de qualquer valor string de um objeto (raso + arrays de string). */
function objectMatchesQuery(obj, query) {
  if (!query) return true;
  const q = normalize(query);
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && normalize(value).includes(q)) return true;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && normalize(item).includes(q)) return true;
      }
    }
  }
  return false;
}

/** Envia uma resposta JSON padronizada. */
function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendError(res, status, message) {
  sendJson(res, status, { erro: message, status });
}

/** Pagina um array com base em query params ?page= e ?limit=. */
function paginate(array, query) {
  const page = Math.max(1, parseInt(query.get('page'), 10) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(query.get('limit'), 10) || array.length || 1));
  const total = array.length;
  const totalPaginas = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const dados = array.slice(start, start + limit);
  return {
    dados,
    paginacao: {
      total,
      pagina: page,
      totalPaginas,
      itensPorPagina: limit,
      temProxima: page < totalPaginas,
      temAnterior: page > 1,
    },
  };
}

/** Filtra array de objetos por igualdade de campo (case-insensitive) se o query param existir. */
function filterByField(array, query, param, field) {
  const value = query.get(param);
  if (!value) return array;
  return array.filter((item) => fuzzyIncludes(item[field], value));
}

/**
 * Lê e faz parse do corpo de uma requisição POST como JSON.
 * maxBytes limita o tamanho (padrão 15MB, dá pra caber uma foto em base64 tranquilo).
 */
function readJsonBody(req, maxBytes = 15 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(Object.assign(new Error('Corpo da requisição muito grande.'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
      } catch (err) {
        reject(Object.assign(new Error('JSON inválido no corpo da requisição.'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

module.exports = {
  normalize,
  fuzzyIncludes,
  objectMatchesQuery,
  sendJson,
  sendError,
  paginate,
  filterByField,
  readJsonBody,
};
