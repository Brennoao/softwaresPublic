#!/usr/bin/env node
'use strict';

/**
 * Baixa todas as imagens (imagemUrl / bannerUrl) referenciadas nos JSONs de data/
 * para uma pasta local `assets/`, organizada por coleção.
 *
 * Rode isso no SEU computador (não dentro de um sandbox na nuvem sem acesso à
 * internet) com: node scripts/baixar-imagens.js
 *
 * Zero dependências — só usa módulos nativos do Node (https, fs, path).
 *
 * IMPORTANTE: as imagens pertencem à Rainbow S.r.l. (Winx Club) e foram
 * localizadas na Winx Club Wiki (Fandom). Isso é só um espelho local pra uso
 * pessoal/fã — não redistribua comercialmente.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const MAX_REDIRECTS = 5;
const CONCURRENCIA = 5;
const TIMEOUT_MS = 20000;

const COLECOES = [
  { arquivo: 'personagens.json', pasta: 'personagens' },
  { arquivo: 'viloes.json', pasta: 'viloes' },
  { arquivo: 'secundarios.json', pasta: 'secundarios' },
  { arquivo: 'transformacoes.json', pasta: 'transformacoes' },
  { arquivo: 'temporadas.json', pasta: 'temporadas' },
];

const CAMPOS_IMAGEM = [
  { campo: 'imagemUrl', sufixo: '' },
  { campo: 'bannerUrl', sufixo: '-banner' },
];

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extensaoDaUrl(url) {
  const semQuery = url.split('?')[0];
  const match = semQuery.match(/\.(png|jpg|jpeg|gif|webp)(?:\/|$)/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

function baixar(url, destino, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        if (redirects >= MAX_REDIRECTS) {
          return reject(new Error('Muitos redirecionamentos'));
        }
        const proximaUrl = new URL(res.headers.location, url).toString();
        return resolve(baixar(proximaUrl, destino, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const contentType = res.headers['content-type'] || '';
      if (!contentType.startsWith('image/')) {
        res.resume();
        return reject(new Error(`Content-Type inesperado: ${contentType || 'desconhecido'}`));
      }
      const arquivo = fs.createWriteStream(destino);
      res.pipe(arquivo);
      arquivo.on('finish', () => arquivo.close(() => resolve(destino)));
      arquivo.on('error', (err) => {
        fs.unlink(destino, () => {});
        reject(err);
      });
    });
    req.on('timeout', () => req.destroy(new Error('Timeout')));
    req.on('error', reject);
  });
}

async function executarComLimite(tarefas, limite) {
  const resultados = [];
  let indice = 0;
  async function worker() {
    while (indice < tarefas.length) {
      const minhaVez = indice++;
      try {
        resultados[minhaVez] = { ok: true, valor: await tarefas[minhaVez].run() };
      } catch (err) {
        resultados[minhaVez] = { ok: false, erro: err.message };
      }
    }
  }
  const workers = Array.from({ length: Math.min(limite, tarefas.length) }, worker);
  await Promise.all(workers);
  return resultados;
}

async function main() {
  const tarefas = [];

  for (const { arquivo, pasta } of COLECOES) {
    const caminho = path.join(DATA_DIR, arquivo);
    if (!fs.existsSync(caminho)) continue;
    const itens = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    const pastaDestino = path.join(ASSETS_DIR, pasta);
    fs.mkdirSync(pastaDestino, { recursive: true });

    for (const item of itens) {
      // Prioriza o nome pra gerar um nome de arquivo legível — o campo "id" agora é um
      // UUID aleatório, então usá-lo aqui geraria nomes de arquivo feios/ilegíveis.
      const idBase = slugify(item.nome || item.numero || item.id || 'item');
      for (const { campo, sufixo } of CAMPOS_IMAGEM) {
        const url = item[campo];
        if (!url) continue;
        const ext = extensaoDaUrl(url);
        const destino = path.join(pastaDestino, `${idBase}${sufixo}${ext}`);
        tarefas.push({
          label: `${pasta}/${idBase}${sufixo}`,
          run: () => baixar(url, destino),
        });
      }
    }
  }

  if (tarefas.length === 0) {
    console.log('Nenhuma URL de imagem encontrada nos dados. Nada para baixar.');
    return;
  }

  console.log(`Baixando ${tarefas.length} imagens para ${ASSETS_DIR} (concorrência: ${CONCURRENCIA})...\n`);

  const resultados = await executarComLimite(tarefas, CONCURRENCIA);

  let sucesso = 0;
  let falha = 0;
  resultados.forEach((r, i) => {
    const label = tarefas[i].label;
    if (r.ok) {
      sucesso++;
      console.log(`✅ ${label}`);
    } else {
      falha++;
      console.log(`❌ ${label} — ${r.erro}`);
    }
  });

  console.log(`\nConcluído: ${sucesso} baixadas, ${falha} falharam.`);
  if (falha > 0) {
    console.log('Falhas são esperadas para links que não puderam ser 100% confirmados na pesquisa — veja o README.');
  }
}

main().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
