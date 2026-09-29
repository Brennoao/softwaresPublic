# 🧚 Winx Club API

API REST **não-oficial** (feita por fã, sem afiliação com a Rainbow S.r.l.) com o máximo de
informações possíveis sobre o desenho **Winx Club** (Clube das Winx): as 7 fadas principais,
vilões, personagens secundários, transformações e as 8 temporadas com todos os 208 episódios.

Escrita em **Node.js puro**, sem nenhuma dependência externa — não precisa rodar `npm install`,
basta ter o Node instalado.

## Como rodar

Requisito: Node.js 18 ou mais recente.

```bash
node server.js
```

O servidor sobe em `http://localhost:3001` (a porta pode ser trocada com a variável de ambiente
`PORT`, ex: `PORT=8080 node server.js`).

Abra `http://localhost:3001/` no navegador para ver a documentação interativa, ou
`http://localhost:3001/api` para a lista de endpoints em JSON.

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Página inicial com documentação em HTML |
| GET | `/admin` | Tela pra completar imagens manualmente (upload de arquivo ou colar URL) — veja a seção [Imagens](#imagens) |
| GET | `/api` | Lista de todos os endpoints (JSON) |
| GET | `/api/stats` | Contagem de itens em cada coleção |
| GET | `/api/busca?q=termo` | Busca um termo em todas as coleções de uma vez |
| GET | `/api/personagens` | As 7 fadas Winx. Suporta `?q=`, `?page=`, `?limit=` |
| GET | `/api/personagens/:id` | Detalhes de uma fada pelo `id` (veja a nota sobre IDs abaixo) |
| GET | `/api/viloes` | Vilões da série. Suporta `?q=`, `?grupo=` (ex: `Trix`), `?page=`, `?limit=` |
| GET | `/api/viloes/:id` | Detalhes de um vilão |
| GET | `/api/secundarios` | Specialistas, professores e outros personagens recorrentes. Suporta `?q=`, `?page=`, `?limit=` |
| GET | `/api/secundarios/:id` | Detalhes de um personagem secundário |
| GET | `/api/transformacoes` | Todas as transformações (Charmix, Enchantix, Believix, Sirenix...). Suporta `?q=` |
| GET | `/api/transformacoes/:id` | Detalhes de uma transformação |
| GET | `/api/temporadas` | As 8 temporadas (sem a lista de episódios, resposta mais leve) |
| GET | `/api/temporadas/:numero` | Detalhes de uma temporada, incluindo todos os episódios |
| GET | `/api/temporadas/:numero/episodios` | Episódios de uma temporada. Suporta `?q=` |
| GET | `/api/temporadas/:numero/episodios/:episodioNumero` | Um episódio específico |
| GET | `/api/episodios` | Todos os 208 episódios juntos. Suporta `?temporada=`, `?q=`, `?page=`, `?limit=` |

### IDs

O campo `id` de `personagens`, `viloes`, `secundarios` e `transformacoes` é um **UUID aleatório**
(ex: `24b25f66-ed42-401c-9290-96a34c7a3a9e`), não mais um nome legível tipo `bloom`. Pra achar o
`id` de alguém, liste a coleção e filtre por nome:

```bash
curl "http://localhost:3001/api/personagens?q=bloom"
```

... pegue o `id` do resultado e use em `GET /api/personagens/:id`. `temporadas` e `episodios`
continuam identificados por número (`:numero`), sem UUID.

### Paginação

Endpoints de listagem retornam sempre o formato:

```json
{
  "dados": [ ... ],
  "paginacao": {
    "total": 208,
    "pagina": 1,
    "totalPaginas": 3,
    "itensPorPagina": 100,
    "temProxima": true,
    "temAnterior": false
  }
}
```

Use `?page=2&limit=20` para navegar.

### Exemplos

```bash
curl "http://localhost:3001/api/personagens?q=bloom"
curl "http://localhost:3001/api/viloes?grupo=Trix"
curl http://localhost:3001/api/temporadas/1/episodios/1
curl "http://localhost:3001/api/episodios?temporada=4&limit=50"
curl "http://localhost:3001/api/busca?q=fogo"
```

## Estrutura do projeto

```
winx-api/
├── data/
│   ├── personagens.json      # As 7 fadas Winx
│   ├── viloes.json           # Trix, Valtor, Lord Darkar, Tritannus...
│   ├── secundarios.json      # Specialistas, professores, etc
│   ├── transformacoes.json   # Charmix, Enchantix, Believix, Sirenix...
│   └── temporadas.json       # 8 temporadas com os 208 episódios
├── lib/
│   ├── data.js         # Carrega os JSONs e sabe salvá-los de volta (usado pelo /admin)
│   ├── router.js       # Router minimalista sem dependências
│   ├── routes.js       # Definição de todos os endpoints da API
│   ├── docsPage.js     # Gera a página HTML de documentação (/)
│   ├── adminPage.js    # Gera a página HTML da tela de admin (/admin)
│   ├── adminRoutes.js  # Rotas de upload/definir-URL da tela de admin
│   └── utils.js        # Helpers: busca, paginação, respostas JSON, leitura de body
├── scripts/
│   └── baixar-imagens.js   # Baixa imagemUrl/bannerUrl pra assets/ local (rode no seu PC)
├── assets/             # Imagens baixadas ou enviadas pela tela de admin (criado sob demanda)
├── server.js           # Ponto de entrada (http.createServer)
├── package.json
└── README.md
```

## Imagens

Cada item de `personagens`, `viloes`, `secundarios` e `transformacoes` tem dois campos de imagem,
e `temporadas` tem `bannerUrl`. Sempre como **link** (URL) — a maioria hospedada na Winx Club Wiki
(Fandom), e os pôsteres de temporada no JustWatch — a API não guarda o arquivo, só a referência:

- `imagemUrl` — foto de perfil / retrato do personagem ou transformação.
- `bannerUrl` — uma imagem maior/destaque (cena, corpo inteiro, pôster), quando encontrada.

Cobertura atual (o campo sempre existe; quando não achei uma URL confiável, o valor é `null` em
vez de um link inventado):

| Coleção | `imagemUrl` | `bannerUrl` |
|---|---|---|
| `personagens` (7) | 7/7 | 7/7 |
| `secundarios` (24) | 24/24 | 5/24 |
| `viloes` (19) | 6/19 | 3/19 |
| `transformacoes` (14) | 11/14 | 1/14 |
| `temporadas` (8) | — | 8/8 |

**Vilões com `imagemUrl`**: Icy, Darcy, Stormy, Lord Darkar, Selina, Gantlos (este último é uma
imagem de efeito/ataque dele em cena, não um retrato — foi o único arquivo real que achei).
Sem imagem confirmada: Valtor, Bruxas Ancestrais, Ogron, Anagan, Duman, Tritannus, Politea,
Mandragora, Acheron, Kalshara, Brafilius, Argen/Obscurum e Knut. Tentei bastante (múltiplas
rodadas, dezenas de técnicas — wikis espelho, subpáginas de galeria, buscas direcionadas) e a
conclusão é que ou esses vilões não têm um retrato próprio catalogado publicamente de um jeito que
eu consiga confirmar, ou a Wikia bloqueia sistematicamente o tipo de acesso automatizado que
revelaria o link (erro 402 em praticamente toda subpágina de galeria/categoria). Prefiro deixar
`null` a arriscar um link quebrado.

**Transformações sem `imagemUrl`**: Winx (forma básica) e Full Believix (não achei evidência) e
Sparkix (não é uma transformação oficialmente confirmada em nenhuma fonte — provavelmente não
deveria nem estar na lista, mantive por completude).

`bannerUrl` é o campo mais incompleto — foi o último a ser adicionado e depende de achar uma
*segunda* imagem diferente da já usada em `imagemUrl`, o que é mais difícil. Se quiser, posso
insistir mais nele numa próxima rodada.

### Baixar as imagens para uma pasta local

Este ambiente na nuvem não tem acesso de rede aos domínios de imagem (só consigo montar o link,
não baixar o arquivo aqui). Por isso incluí um script pra você rodar **no seu computador**, que
baixa toda imagem/banner não-nulo pra uma pasta `assets/` local:

```bash
node scripts/baixar-imagens.js
```

Zero dependências (só `https`, `fs`, `path` do próprio Node). Ele organiza os arquivos assim:

```
assets/
├── personagens/bloom.png, bloom-banner.jpg, stella.png, ...
├── secundarios/sky.png, brandon.png, ...
├── viloes/lord-darkar.png, selina.png
└── transformacoes/believix.jpg, sirenix.jpg, ...
```

Baixa em paralelo (5 por vez), pula o que já sabe que é `null`, e no final mostra um relatório
`✅`/`❌` por item — é normal ver algumas falhas (403/404), porque nem todo link pôde ser 100%
confirmado durante a pesquisa (veja a seção seguinte). As imagens pertencem à Rainbow S.r.l.; isso
é só um espelho local pra uso pessoal/de fã, não pra redistribuição comercial.

### Por que tantos ficaram `null`

A Winx Club Wiki bloqueia acesso automatizado à sua API oficial (retorna erro 402) e a conversão
de página em texto que uso pra pesquisar remove as URLs de imagem, deixando só o nome do arquivo
às vezes visível no meio do texto (legendas, trivia). Cada `imagemUrl`/`bannerUrl` preenchido veio
de um nome de arquivo real encontrado dessa forma, com a URL final remontada calculando o hash MD5
que a Wikia usa pra organizar os arquivos (e eu conferi essa conta depois, corrigindo alguns casos
em que o cálculo tinha saído errado). Quando não achei nome de arquivo nenhum com essa evidência,
deixei `null` em vez de arriscar um link inventado/quebrado — dá pra completar manualmente depois
pegando os links direto em https://winx.fandom.com, ou usando a tela de admin abaixo.

### Completar imagens manualmente — tela de admin

Com o servidor rodando (`node server.js`), abra **`http://localhost:3001/admin`** no navegador.
É uma tela que lista todo item de toda coleção com a foto de perfil e o banner atuais (ou "sem
imagem" quando está `null`), e pra cada um você pode:

- **Enviar um arquivo** do seu computador — fica salvo em `assets/{colecao}/` e o caminho é
  gravado automaticamente no JSON correspondente em `data/`.
- **Colar uma URL** — grava direto essa URL no campo, sem precisar baixar nada.

Tem um filtro de texto e um checkbox "Só mostrar quem falta imagem" pra focar só no que falta.
Toda alteração é salva na hora (sem precisar reiniciar o servidor nem apertar nenhum botão de
"salvar tudo") — é só recarregar a página depois pra conferir. Como isso escreve direto nos
arquivos do projeto, use só localmente (não deixe essa tela exposta publicamente na internet, ela
não tem login).

## Sobre a precisão dos dados

Os dados foram pesquisados em fontes públicas (Wikipedia em português e inglês, Winx Club Wiki
no Fandom) e cruzados entre pelo menos duas fontes sempre que possível. Campos que não puderam
ser confirmados com segurança foram deixados como `null` em vez de inventados — então é normal
encontrar alguns `null` espalhados pelos dados (ex: nome completo de algumas personagens, alguns
detalhes da 8ª temporada, que é mais recente e tem cobertura wiki mais escassa).

Os **títulos dos episódios estão em inglês** (título original), pois não foi possível confirmar
com segurança os títulos da dublagem brasileira para as 208 entradas sem risco de erro — as
sinopses foram traduzidas para o português.

Este projeto é feito por fã, para fins educacionais e de entretenimento. Winx Club é uma marca
registrada da Rainbow S.r.l.
