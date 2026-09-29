import personagens from "@/data/personagens.json";
import secundarios from "@/data/secundarios.json";
import temporadas from "@/data/temporadas.json";
import transformacoes from "@/data/transformacoes.json";
import viloes from "@/data/viloes.json";

function normalize(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function fuzzyIncludes(haystack: unknown, needle: string): boolean {
  if (!needle) return true;
  return normalize(haystack).includes(normalize(needle));
}

function objectMatchesQuery(obj: Record<string, any>, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  for (const value of Object.values(obj)) {
    if (typeof value === "string" && normalize(value).includes(q)) return true;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && normalize(item).includes(q)) return true;
      }
    }
  }
  return false;
}

function paginate(array: any[]) {
  return {
    dados: array,
    paginacao: {
      total: array.length,
      pagina: 1,
      totalPaginas: 1,
      itensPorPagina: array.length || 1,
      temProxima: false,
      temAnterior: false,
    },
  };
}

function findById(array: { id: string }[], id: string) {
  return array.find((item) => String(item.id).toLowerCase() === String(id).toLowerCase());
}

class LocalApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function parseUrl(endpoint: string) {
  const [path, queryString] = endpoint.split("?");
  const params = new URLSearchParams(queryString ?? "");
  const segments = path.split("/").filter(Boolean);
  return { segments, params };
}

/**
 * Reimplementação, do lado do cliente, das rotas da winx-api que o app usa —
 * só entra em ação na web (sem servidor pra falar com o `localhost`), usando
 * os mesmos dados que a API real serve, embutidos no build (`src/data/`).
 */
function resolve(endpoint: string): unknown {
  const { segments, params } = parseUrl(endpoint);
  const q = params.get("q") ?? "";

  if (segments[0] === "stats") {
    const totalEpisodios = temporadas.reduce(
      (total, t) => total + (t.episodios?.length ?? 0),
      0
    );
    return {
      personagens: personagens.length,
      viloes: viloes.length,
      secundarios: secundarios.length,
      transformacoes: transformacoes.length,
      temporadas: temporadas.length,
      episodios: totalEpisodios,
    };
  }

  if (segments[0] === "busca") {
    if (!q) throw new LocalApiError(400, "Informe um termo de busca com ?q=termo");
    const resultado = {
      termo: q,
      personagens: personagens.filter((p) => objectMatchesQuery(p, q)),
      viloes: viloes.filter((v) => objectMatchesQuery(v, q)),
      secundarios: secundarios.filter((s) => objectMatchesQuery(s, q)),
      transformacoes: transformacoes.filter((t) => objectMatchesQuery(t, q)),
    };
    return {
      ...resultado,
      totalResultados:
        resultado.personagens.length +
        resultado.viloes.length +
        resultado.secundarios.length +
        resultado.transformacoes.length,
    };
  }

  if (segments[0] === "personagens") {
    if (segments[1]) {
      const item = findById(personagens, segments[1]);
      if (!item) throw new LocalApiError(404, `Personagem "${segments[1]}" não encontrado.`);
      return item;
    }
    const lista = q ? personagens.filter((p) => objectMatchesQuery(p, q)) : personagens;
    return paginate(lista);
  }

  if (segments[0] === "viloes") {
    if (segments[1]) {
      const item = findById(viloes, segments[1]);
      if (!item) throw new LocalApiError(404, `Vilão "${segments[1]}" não encontrado.`);
      return item;
    }
    let lista = q ? viloes.filter((v) => objectMatchesQuery(v, q)) : viloes;
    const grupo = params.get("grupo");
    if (grupo) lista = lista.filter((v) => fuzzyIncludes(v.grupo, grupo));
    return paginate(lista);
  }

  if (segments[0] === "secundarios") {
    if (segments[1]) {
      const item = findById(secundarios, segments[1]);
      if (!item) throw new LocalApiError(404, `Personagem secundário "${segments[1]}" não encontrado.`);
      return item;
    }
    const lista = q ? secundarios.filter((s) => objectMatchesQuery(s, q)) : secundarios;
    return paginate(lista);
  }

  if (segments[0] === "transformacoes") {
    if (segments[1]) {
      const item = findById(transformacoes, segments[1]);
      if (!item) throw new LocalApiError(404, `Transformação "${segments[1]}" não encontrada.`);
      return item;
    }
    const lista = q ? transformacoes.filter((t) => objectMatchesQuery(t, q)) : transformacoes;
    return paginate(lista);
  }

  if (segments[0] === "temporadas") {
    if (!segments[1]) {
      return temporadas.map(({ episodios, ...resto }) => resto);
    }

    const numero = parseInt(segments[1], 10);
    const temporada = temporadas.find((t) => t.numero === numero);
    if (!temporada) {
      throw new LocalApiError(
        404,
        `Temporada ${segments[1]} não encontrada. Use um número de 1 a ${temporadas.length}.`
      );
    }

    if (segments[2] === "episodios" && segments[3]) {
      const epNumero = parseInt(segments[3], 10);
      const episodio = (temporada.episodios ?? []).find((ep) => ep.numero === epNumero);
      if (!episodio) {
        throw new LocalApiError(
          404,
          `Episódio ${segments[3]} não encontrado na temporada ${numero}.`
        );
      }
      return { temporada: numero, ...episodio };
    }

    return temporada;
  }

  throw new LocalApiError(404, `Endpoint desconhecido: ${endpoint}`);
}

/** Interface parecida com a do axios (`{ data }`), pra `winksApi.get(...)` funcionar igual na web. */
const localApi = {
  async get<T = unknown>(endpoint: string): Promise<{ data: T }> {
    return { data: resolve(endpoint) as T };
  },
};

export default localApi;
