'use strict';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Quais coleções mostrar, em que ordem, e quais campos de imagem cada uma aceita.
const SECOES = [
  { colecao: 'personagens', titulo: 'Personagens (Winx)', campos: ['imagemUrl', 'bannerUrl'] },
  { colecao: 'viloes', titulo: 'Vilões', campos: ['imagemUrl', 'bannerUrl'] },
  { colecao: 'secundarios', titulo: 'Secundários', campos: ['imagemUrl', 'bannerUrl'] },
  { colecao: 'transformacoes', titulo: 'Transformações', campos: ['imagemUrl', 'bannerUrl'] },
  { colecao: 'temporadas', titulo: 'Temporadas', campos: ['bannerUrl'] },
];

const NOMES_CAMPO = { imagemUrl: 'Foto de perfil', bannerUrl: 'Banner' };

function nomeDoItem(item, colecao) {
  if (colecao === 'temporadas') return `Temporada ${item.numero}`;
  return item.nome || item.id;
}

function idDoItem(item, colecao) {
  return colecao === 'temporadas' ? String(item.numero) : String(item.id);
}

function renderCampo(colecao, id, campo, valorAtual) {
  const inputId = `${colecao}-${id}-${campo}`;
  const valorEscapado = valorAtual ? escapeHtml(valorAtual) : '';
  return `
    <div class="campo" data-campo="${campo}">
      <div class="campo-label">${NOMES_CAMPO[campo]}</div>
      <div class="thumb-wrap">
        <img class="thumb" id="img-${inputId}" src="${valorEscapado}" alt=""
             style="${valorAtual ? '' : 'display:none;'}"
             onerror="this.classList.add('quebrada'); this.style.display='none'; const v=this.nextElementSibling; v.textContent='falhou ao carregar'; v.style.display='';"
             onload="this.classList.remove('quebrada'); this.nextElementSibling.style.display='none';">
        <div class="thumb-vazia" id="vazia-${inputId}" style="${valorAtual ? 'display:none;' : ''}">sem imagem</div>
      </div>
      <label class="botao-arquivo">
        Enviar arquivo…
        <input type="file" accept="image/*" onchange="enviarArquivo('${colecao}','${id}','${campo}',this)">
      </label>
      <div class="ou">ou cole uma URL:</div>
      <div class="url-row">
        <input type="text" id="url-${inputId}" placeholder="https://..." value="${valorEscapado}">
        <button onclick="definirUrl('${colecao}','${id}','${campo}')">OK</button>
      </div>
      <div class="status" id="status-${inputId}"></div>
    </div>`;
}

function renderCard(item, colecao, campos) {
  const id = idDoItem(item, colecao);
  const nome = escapeHtml(nomeDoItem(item, colecao));
  const faltando = campos.filter((c) => !item[c]).length;
  return `
  <div class="card" data-colecao="${colecao}" data-faltando="${faltando > 0 ? '1' : '0'}">
    <div class="card-titulo">${nome}${faltando > 0 ? `<span class="badge-faltando">${faltando} faltando</span>` : '<span class="badge-completo">completo</span>'}</div>
    <div class="campos">
      ${campos.map((campo) => renderCampo(colecao, id, campo, item[campo])).join('')}
    </div>
  </div>`;
}

function renderAdminPage(collections) {
  const secoesHtml = SECOES.map(({ colecao, titulo, campos }) => {
    const itens = collections[colecao].arr;
    const cards = itens.map((item) => renderCard(item, colecao, campos)).join('');
    return `
    <section class="secao" data-secao="${colecao}">
      <h2>${titulo} <span class="contagem">(${itens.length})</span></h2>
      <div class="grid">${cards}</div>
    </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Winx Club API — Admin de Imagens</title>
<style>
  :root {
    --pink: #ff2d8a; --purple: #7b2ff7; --blue: #2d9cff;
    --bg: #120e26; --card: #1c1640; --text: #f3f0ff; --muted: #b9b0e0;
    --ok: #3ddc97; --warn: #ffb020;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: radial-gradient(circle at top, #241a4d 0%, var(--bg) 60%);
    color: var(--text); padding: 1.5rem 1.25rem 4rem;
  }
  .wrap { max-width: 1200px; margin: 0 auto; }
  h1 {
    font-size: 1.9rem; margin: 0 0 0.25rem;
    background: linear-gradient(90deg, var(--pink), var(--purple), var(--blue));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .subtitle { color: var(--muted); margin: 0 0 1.25rem; line-height: 1.5; max-width: 70ch; }
  .toolbar {
    position: sticky; top: 0; z-index: 5; display: flex; gap: 0.75rem; flex-wrap: wrap;
    align-items: center; background: rgba(18,14,38,0.92); backdrop-filter: blur(6px);
    padding: 0.75rem 0; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .toolbar input[type="text"] {
    flex: 1; min-width: 180px; background: var(--card); border: 1px solid rgba(255,255,255,0.12);
    color: var(--text); padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.9rem;
  }
  .toolbar label { color: var(--muted); font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; }
  h2 { font-size: 1.2rem; margin: 1.75rem 0 0.75rem; }
  .contagem { color: var(--muted); font-weight: 400; font-size: 0.9rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
  .card {
    background: var(--card); border-radius: 14px; padding: 1rem;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .card-titulo { font-weight: 600; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .badge-faltando, .badge-completo {
    font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; letter-spacing: 0.02em;
  }
  .badge-faltando { background: rgba(255,176,32,0.18); color: var(--warn); }
  .badge-completo { background: rgba(61,220,151,0.15); color: var(--ok); }
  .campos { display: flex; flex-direction: column; gap: 0.9rem; }
  .campo { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem; }
  .campo:first-child { border-top: none; padding-top: 0; }
  .campo-label { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .thumb-wrap {
    width: 100%; height: 130px; border-radius: 8px; overflow: hidden; margin-bottom: 0.5rem;
    background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center;
  }
  .thumb { width: 100%; height: 100%; object-fit: cover; }
  .thumb.quebrada { display: none; }
  .thumb-vazia { color: var(--muted); font-size: 0.8rem; }
  .botao-arquivo {
    display: block; text-align: center; background: linear-gradient(90deg, var(--pink), var(--purple));
    color: white; font-size: 0.82rem; font-weight: 600; padding: 0.45rem; border-radius: 8px;
    cursor: pointer; margin-bottom: 0.4rem;
  }
  .botao-arquivo input { display: none; }
  .ou { font-size: 0.72rem; color: var(--muted); text-align: center; margin: 0.3rem 0; }
  .url-row { display: flex; gap: 0.4rem; }
  .url-row input {
    flex: 1; min-width: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    color: var(--text); padding: 0.4rem 0.5rem; border-radius: 6px; font-size: 0.78rem;
  }
  .url-row button {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: var(--text);
    padding: 0.4rem 0.7rem; border-radius: 6px; cursor: pointer; font-size: 0.78rem;
  }
  .url-row button:hover { background: rgba(255,255,255,0.18); }
  .status { font-size: 0.72rem; margin-top: 0.3rem; min-height: 1em; }
  .status.ok { color: var(--ok); }
  .status.erro { color: #ff6b6b; }
  .card[data-oculto="1"] { display: none; }
  a.voltar { color: #9fd8ff; text-decoration: none; font-size: 0.85rem; }
</style>
</head>
<body>
  <div class="wrap">
    <a class="voltar" href="/">&larr; voltar pra documentação da API</a>
    <h1>🖼️ Admin de Imagens</h1>
    <p class="subtitle">
      Complete manualmente as imagens que a pesquisa automática não conseguiu confirmar. Envie um
      arquivo do seu computador ou cole uma URL — qualquer uma das duas formas salva direto no
      JSON em <code>data/</code> (e um arquivo enviado fica salvo em <code>assets/</code>).
    </p>
    <div class="toolbar">
      <input type="text" id="busca" placeholder="Filtrar por nome..." oninput="aplicarFiltros()">
      <label><input type="checkbox" id="soFaltando" onchange="aplicarFiltros()"> Só mostrar quem falta imagem</label>
    </div>
    ${secoesHtml}
  </div>

  <script>
    function aplicarFiltros() {
      const termo = document.getElementById('busca').value.trim().toLowerCase();
      const soFaltando = document.getElementById('soFaltando').checked;
      document.querySelectorAll('.card').forEach((card) => {
        const titulo = card.querySelector('.card-titulo').textContent.toLowerCase();
        const bateBusca = !termo || titulo.includes(termo);
        const faltando = card.getAttribute('data-faltando') === '1';
        const mostrar = bateBusca && (!soFaltando || faltando);
        card.setAttribute('data-oculto', mostrar ? '0' : '1');
      });
    }

    function setStatus(id, msg, tipo) {
      const el = document.getElementById('status-' + id);
      el.textContent = msg;
      el.className = 'status' + (tipo ? ' ' + tipo : '');
    }

    function atualizarThumb(id, url) {
      const img = document.getElementById('img-' + id);
      const vazia = document.getElementById('vazia-' + id);
      const urlInput = document.getElementById('url-' + id);
      img.classList.remove('quebrada');
      if (vazia) vazia.textContent = 'sem imagem';
      if (url) {
        img.src = url;
        img.style.display = '';
        if (vazia) vazia.style.display = 'none';
      } else {
        img.removeAttribute('src');
        img.style.display = 'none';
        if (vazia) vazia.style.display = '';
      }
      if (urlInput) urlInput.value = url || '';
    }

    async function enviarArquivo(colecao, id, campo, input) {
      const inputId = colecao + '-' + id + '-' + campo;
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setStatus(inputId, 'Isso não parece ser uma imagem.', 'erro');
        return;
      }
      setStatus(inputId, 'Enviando...', '');
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const resp = await fetch('/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ colecao, id, campo, filename: file.name, dataUrl }),
        });
        const dados = await resp.json();
        if (!resp.ok) throw new Error(dados.erro || ('HTTP ' + resp.status));
        atualizarThumb(inputId, dados.url);
        setStatus(inputId, 'Salvo ✓', 'ok');
      } catch (err) {
        setStatus(inputId, 'Erro: ' + err.message, 'erro');
      } finally {
        input.value = '';
      }
    }

    async function definirUrl(colecao, id, campo) {
      const inputId = colecao + '-' + id + '-' + campo;
      const url = document.getElementById('url-' + inputId).value.trim();
      setStatus(inputId, 'Salvando...', '');
      try {
        const resp = await fetch('/admin/set-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ colecao, id, campo, url }),
        });
        const dados = await resp.json();
        if (!resp.ok) throw new Error(dados.erro || ('HTTP ' + resp.status));
        atualizarThumb(inputId, dados.url);
        setStatus(inputId, url ? 'Salvo ✓' : 'Removido', 'ok');
      } catch (err) {
        setStatus(inputId, 'Erro: ' + err.message, 'erro');
      }
    }
  </script>
</body>
</html>`;
}

module.exports = renderAdminPage;
