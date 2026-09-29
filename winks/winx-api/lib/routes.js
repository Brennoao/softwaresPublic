'use strict';

const Router = require('./router');
const db = require('./data');
const { sendJson, sendError, paginate, fuzzyIncludes, objectMatchesQuery } = require('./utils');

const router = new Router();

const ENDPOINTS = [
  { metodo: 'GET', caminho: '/', descricao: 'Página inicial com documentação em HTML' },
  { metodo: 'GET', caminho: '/admin', descricao: 'Tela pra completar imagens manualmente (upload de arquivo ou colar uma URL)' },
  { metodo: 'GET', caminho: '/api', descricao: 'Lista de todos os endpoints (JSON)' },
  { metodo: 'GET', caminho: '/api/stats', descricao: 'Estatísticas gerais dos dados da API' },
  { metodo: 'GET', caminho: '/api/busca?q=termo', descricao: 'Busca por termo em todas as coleções (personagens, vilões, secundários, transformações)' },
  { metodo: 'GET', caminho: '/api/personagens', descricao: 'Lista as 7 fadas principais (Winx). Suporta ?q=, ?page=, ?limit=' },
  { metodo: 'GET', caminho: '/api/personagens/:id', descricao: 'Detalhes de uma fada pelo id (o id é um UUID aleatório — pegue-o em GET /api/personagens ou via ?q=nome)' },
  { metodo: 'GET', caminho: '/api/viloes', descricao: 'Lista os vilões da série. Suporta ?q=, ?grupo=, ?page=, ?limit=' },
  { metodo: 'GET', caminho: '/api/viloes/:id', descricao: 'Detalhes de um vilão pelo id' },
  { metodo: 'GET', caminho: '/api/secundarios', descricao: 'Lista personagens secundários (Specialistas, professores, etc). Suporta ?q=, ?page=, ?limit=' },
  { metodo: 'GET', caminho: '/api/secundarios/:id', descricao: 'Detalhes de um personagem secundário pelo id' },
  { metodo: 'GET', caminho: '/api/transformacoes', descricao: 'Lista todas as transformações (Charmix, Enchantix, Believix, etc). Suporta ?q=' },
  { metodo: 'GET', caminho: '/api/transformacoes/:id', descricao: 'Detalhes de uma transformação pelo id' },
  { metodo: 'GET', caminho: '/api/temporadas', descricao: 'Lista as 8 temporadas com sinopse e metadados (sem a lista de episódios, para respostas leves)' },
  { metodo: 'GET', caminho: '/api/temporadas/:numero', descricao: 'Detalhes de uma temporada, incluindo todos os episódios' },
  { metodo: 'GET', caminho: '/api/temporadas/:numero/episodios', descricao: 'Lista os episódios de uma temporada. Suporta ?q=' },
  { metodo: 'GET', caminho: '/api/temporadas/:numero/episodios/:episodioNumero', descricao: 'Detalhes de um episódio específico' },
  { metodo: 'GET', caminho: '/api/episodios', descricao: 'Lista TODOS os episódios das 8 temporadas (achatado). Suporta ?temporada=, ?q=, ?page=, ?limit=' },
];

function findById(array, id) {
  return array.find((item) => String(item.id).toLowerCase() === String(id).toLowerCase());
}

// --- Documentação / meta ---------------------------------------------------

router.get('/api', (req, res) => {
  sendJson(res, 200, {
    nome: 'Winx Club API',
    descricao: 'API REST não-oficial, feita por fã, com o máximo de informações possíveis sobre o desenho Winx Club (Clube das Winx).',
    versao: '1.0.0',
    totalEndpoints: ENDPOINTS.length,
    endpoints: ENDPOINTS,
  });
});

router.get('/api/stats', (req, res) => {
  sendJson(res, 200, {
    personagens: db.personagens.length,
    viloes: db.viloes.length,
    secundarios: db.secundarios.length,
    transformacoes: db.transformacoes.length,
    temporadas: db.temporadas.length,
    episodios: db.episodios.length,
  });
});

router.get('/api/busca', (req, res, { query }) => {
  const q = query.get('q');
  if (!q) {
    return sendError(res, 400, 'Informe um termo de busca com ?q=termo');
  }
  const resultado = {
    termo: q,
    personagens: db.personagens.filter((p) => objectMatchesQuery(p, q)),
    viloes: db.viloes.filter((v) => objectMatchesQuery(v, q)),
    secundarios: db.secundarios.filter((s) => objectMatchesQuery(s, q)),
    transformacoes: db.transformacoes.filter((t) => objectMatchesQuery(t, q)),
  };
  resultado.totalResultados =
    resultado.personagens.length + resultado.viloes.length + resultado.secundarios.length + resultado.transformacoes.length;
  sendJson(res, 200, resultado);
});

// --- Personagens principais --------------------------------------------------

router.get('/api/personagens', (req, res, { query }) => {
  let lista = db.personagens;
  const q = query.get('q');
  if (q) lista = lista.filter((p) => objectMatchesQuery(p, q));
  sendJson(res, 200, paginate(lista, query));
});

router.get('/api/personagens/:id', (req, res, { params }) => {
  const item = findById(db.personagens, params.id);
  if (!item) return sendError(res, 404, `Personagem "${params.id}" não encontrado.`);
  sendJson(res, 200, item);
});

// --- Vilões -------------------------------------------------------------

router.get('/api/viloes', (req, res, { query }) => {
  let lista = db.viloes;
  const q = query.get('q');
  const grupo = query.get('grupo');
  if (q) lista = lista.filter((v) => objectMatchesQuery(v, q));
  if (grupo) lista = lista.filter((v) => fuzzyIncludes(v.grupo, grupo));
  sendJson(res, 200, paginate(lista, query));
});

router.get('/api/viloes/:id', (req, res, { params }) => {
  const item = findById(db.viloes, params.id);
  if (!item) return sendError(res, 404, `Vilão "${params.id}" não encontrado.`);
  sendJson(res, 200, item);
});

// --- Secundários ----------------------------------------------------------

router.get('/api/secundarios', (req, res, { query }) => {
  let lista = db.secundarios;
  const q = query.get('q');
  if (q) lista = lista.filter((s) => objectMatchesQuery(s, q));
  sendJson(res, 200, paginate(lista, query));
});

router.get('/api/secundarios/:id', (req, res, { params }) => {
  const item = findById(db.secundarios, params.id);
  if (!item) return sendError(res, 404, `Personagem secundário "${params.id}" não encontrado.`);
  sendJson(res, 200, item);
});

// --- Transformações ---------------------------------------------------------

router.get('/api/transformacoes', (req, res, { query }) => {
  let lista = db.transformacoes;
  const q = query.get('q');
  if (q) lista = lista.filter((t) => objectMatchesQuery(t, q));
  sendJson(res, 200, paginate(lista, query));
});

router.get('/api/transformacoes/:id', (req, res, { params }) => {
  const item = findById(db.transformacoes, params.id);
  if (!item) return sendError(res, 404, `Transformação "${params.id}" não encontrada.`);
  sendJson(res, 200, item);
});

// --- Temporadas e episódios ------------------------------------------------

router.get('/api/temporadas', (req, res) => {
  const semEpisodios = db.temporadas.map(({ episodios, ...resto }) => resto);
  sendJson(res, 200, semEpisodios);
});

router.get('/api/temporadas/:numero', (req, res, { params }) => {
  const numero = parseInt(params.numero, 10);
  const temporada = db.temporadas.find((t) => t.numero === numero);
  if (!temporada) return sendError(res, 404, `Temporada ${params.numero} não encontrada. Use um número de 1 a ${db.temporadas.length}.`);
  sendJson(res, 200, temporada);
});

router.get('/api/temporadas/:numero/episodios', (req, res, { params, query }) => {
  const numero = parseInt(params.numero, 10);
  const temporada = db.temporadas.find((t) => t.numero === numero);
  if (!temporada) return sendError(res, 404, `Temporada ${params.numero} não encontrada. Use um número de 1 a ${db.temporadas.length}.`);
  let episodios = temporada.episodios || [];
  const q = query.get('q');
  if (q) episodios = episodios.filter((ep) => fuzzyIncludes(ep.titulo, q) || fuzzyIncludes(ep.sinopse, q));
  sendJson(res, 200, paginate(episodios, query));
});

router.get('/api/temporadas/:numero/episodios/:episodioNumero', (req, res, { params }) => {
  const numero = parseInt(params.numero, 10);
  const epNumero = parseInt(params.episodioNumero, 10);
  const temporada = db.temporadas.find((t) => t.numero === numero);
  if (!temporada) return sendError(res, 404, `Temporada ${params.numero} não encontrada.`);
  const episodio = (temporada.episodios || []).find((ep) => ep.numero === epNumero);
  if (!episodio) return sendError(res, 404, `Episódio ${params.episodioNumero} não encontrado na temporada ${numero}.`);
  sendJson(res, 200, { temporada: numero, ...episodio });
});

router.get('/api/episodios', (req, res, { query }) => {
  let lista = db.episodios;
  const temporada = query.get('temporada');
  const q = query.get('q');
  if (temporada) lista = lista.filter((ep) => String(ep.temporada) === String(parseInt(temporada, 10)));
  if (q) lista = lista.filter((ep) => fuzzyIncludes(ep.titulo, q) || fuzzyIncludes(ep.sinopse, q));
  sendJson(res, 200, paginate(lista, query));
});

module.exports = { router, ENDPOINTS };
