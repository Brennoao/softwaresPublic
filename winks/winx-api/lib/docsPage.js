'use strict';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderDocsHtml(endpoints, port) {
  const rows = endpoints
    .map(
      (e) => `
      <tr>
        <td><span class="method">${escapeHtml(e.metodo)}</span></td>
        <td><code>${escapeHtml(e.caminho)}</code></td>
        <td>${escapeHtml(e.descricao)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Winx Club API</title>
<style>
  :root {
    --pink: #ff2d8a;
    --purple: #7b2ff7;
    --blue: #2d9cff;
    --bg: #120e26;
    --card: #1c1640;
    --text: #f3f0ff;
    --muted: #b9b0e0;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: radial-gradient(circle at top, #241a4d 0%, var(--bg) 60%);
    color: var(--text);
    padding: 2.5rem 1.5rem 4rem;
  }
  .wrap { max-width: 880px; margin: 0 auto; }
  h1 {
    font-size: 2.2rem;
    margin: 0 0 0.25rem;
    background: linear-gradient(90deg, var(--pink), var(--purple), var(--blue));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .subtitle { color: var(--muted); margin: 0 0 2rem; line-height: 1.5; }
  .badge {
    display: inline-block;
    background: var(--card);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    color: var(--muted);
    margin-right: 0.5rem;
  }
  .card {
    background: var(--card);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.06);
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th { text-align: left; color: var(--muted); font-weight: 600; padding: 0.5rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  td { padding: 0.6rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; }
  code { background: rgba(255,255,255,0.08); padding: 0.15rem 0.4rem; border-radius: 6px; font-size: 0.85rem; }
  .method {
    background: linear-gradient(90deg, var(--pink), var(--purple));
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    letter-spacing: 0.05em;
  }
  a { color: #9fd8ff; }
  footer { color: var(--muted); font-size: 0.85rem; text-align: center; margin-top: 2rem; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>🧚 Winx Club API</h1>
    <p class="subtitle">
      API REST não-oficial, feita por fã, com o máximo de informações possíveis sobre o desenho
      <strong>Winx Club</strong> (Clube das Winx): personagens, vilões, personagens secundários,
      transformações e as 8 temporadas com episódios.
    </p>
    <span class="badge">Node.js puro — sem dependências</span>
    <span class="badge">Porta ${port}</span>
    <span class="badge">JSON</span>

    <div class="card">
      <table>
        <thead><tr><th>Método</th><th>Endpoint</th><th>Descrição</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <div class="card">
      <strong>Exemplos rápidos</strong>
      <p style="color: var(--muted); line-height: 1.8;">
        <code>GET /api/personagens</code> — todas as fadas Winx (cada uma com seu <code>id</code>)<br>
        <code>GET /api/personagens/:id</code> — detalhes de uma fada (use o <code>id</code> retornado na lista, ex: <code>?q=bloom</code> pra achar a Bloom)<br>
        <code>GET /api/viloes?grupo=Trix</code> — vilãs do grupo Trix<br>
        <code>GET /api/temporadas/1/episodios</code> — episódios da temporada 1<br>
        <code>GET /api/busca?q=fogo</code> — busca "fogo" em toda a API
      </p>
    </div>

    <footer>Dados coletados de fontes públicas (Wikipedia, Winx Club Wiki) para fins educacionais/fã. Sem afiliação com a Rainbow S.r.l.</footer>
  </div>
</body>
</html>`;
}

module.exports = renderDocsHtml;
