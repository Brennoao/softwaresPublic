'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function load(file) {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  return JSON.parse(raw);
}

const personagens = load('personagens.json');
const viloes = load('viloes.json');
const secundarios = load('secundarios.json');
const transformacoes = load('transformacoes.json');
const temporadas = load('temporadas.json');

// Lista "achatada" de todos os episódios, cada um carregando o número da sua temporada.
const episodios = temporadas.flatMap((temporada) =>
  (temporada.episodios || []).map((ep) => ({
    temporada: temporada.numero,
    ...ep,
  }))
);

// Registro central das coleções que podem ser editadas pela tela de admin (/admin).
// idField diz qual campo identifica cada item dentro da coleção (a maioria usa "id",
// temporadas usa "numero"). pasta é o nome da subpasta usada em assets/ e nas rotas estáticas.
const COLLECTIONS = {
  personagens: { arr: personagens, arquivo: 'personagens.json', idField: 'id', pasta: 'personagens' },
  viloes: { arr: viloes, arquivo: 'viloes.json', idField: 'id', pasta: 'viloes' },
  secundarios: { arr: secundarios, arquivo: 'secundarios.json', idField: 'id', pasta: 'secundarios' },
  transformacoes: { arr: transformacoes, arquivo: 'transformacoes.json', idField: 'id', pasta: 'transformacoes' },
  temporadas: { arr: temporadas, arquivo: 'temporadas.json', idField: 'numero', pasta: 'temporadas' },
};

/** Persiste o estado atual em memória de uma coleção de volta no arquivo JSON em data/. */
function saveCollection(nomeColecao) {
  const colecao = COLLECTIONS[nomeColecao];
  if (!colecao) throw new Error(`Coleção desconhecida: ${nomeColecao}`);
  const destino = path.join(DATA_DIR, colecao.arquivo);
  fs.writeFileSync(destino, JSON.stringify(colecao.arr, null, 2) + '\n');
}

module.exports = {
  personagens,
  viloes,
  secundarios,
  transformacoes,
  temporadas,
  episodios,
  COLLECTIONS,
  saveCollection,
};
