export type WinxApi = {
  Info: {
    nome: string;
    descricao: string;
    versao: string;
    totalEndpoints: number;
    endpoints: { metodo: 'GET' | 'POST' | 'PUT' | 'DELETE'; caminho: string; descricao: string }[];
  };

  Stats: {
    personagens: number;
    viloes: number;
    secundarios: number;
    transformacoes: number;
    temporadas: number;
    episodios: number;
  };

  Personagem: {
    id: string;
    nome: string;
    nomeCompleto: string | null;
    planetaOrigem: string;
    tituloFada: string;
    dataNascimento: string;
    corCabelo: string;
    corOlhos: string;
    personalidade: string[];
    poderes: string[];
    transformacoes: string[];
    pet: string;
    familia: { pais: string[]; irmaos: string[] | null };
    interesseAmoroso: string | null;
    melhoresAmigas: string[];
    talentoEspecial: string;
    primeiraAparicao: string;
    dubladorOriginal: string;
    dubladorBrasil: string;
    biografia: string;
    imagemUrl: string;
    bannerUrl: string | null;
  };

  Vilao: {
    id: string;
    nome: string;
    grupo: string | null;
    tipo: string;
    origem: string | null;
    poderes: string[] | null;
    personalidade: string[] | null;
    temporadas: string[];
    objetivo: string;
    comoEDerrotada: string;
    biografia: string;
    imagemUrl: string | null;
    bannerUrl: string | null;
  };

  Secundario: {
    id: string;
    nome: string;
    papel: string;
    escolaOuLocal: string;
    relacaoComWinx: string;
    poderes: string[] | null;
    biografia: string;
    imagemUrl: string;
    bannerUrl: string | null;
  };

  Transformacao: {
    id: string;
    nome: string;
    temporadaIntroduzida: number | null;
    comoEObtida: string | null;
    descricaoAparencia: string | null;
    novosPoderes: string[] | null;
    personagensQuePossuem: string[] | null;
    objetoAssociado: string | null;
    imagemUrl: string | null;
    bannerUrl: string | null;
    observacao: string;
  };

  EpisodioResumo: {
    numero: number;
    titulo: string;
    sinopse: string;
  };

  Episodio: WinxApi['EpisodioResumo'] & { temporada: number };

  Temporada: {
    numero: number;
    anoEstreia: number;
    totalEpisodios: number;
    sinopse: string;
    transformacaoIntroduzida: string;
    principaisViloes: string[];
    bannerUrl: string | null;
  };

  TemporadaDetalhe: WinxApi['Temporada'] & { episodios: WinxApi['EpisodioResumo'][] };

  BuscaResultado: {
    termo: string;
    personagens: WinxApi['Personagem'][];
    viloes: WinxApi['Vilao'][];
    secundarios: WinxApi['Secundario'][];
    transformacoes: WinxApi['Transformacao'][];
    totalResultados: number;
  };

  Data: {
    personagens: Paginated<WinxApi['Personagem']>;
    viloes: Paginated<WinxApi['Vilao']>;
    secundarios: Paginated<WinxApi['Secundario']>;
    transformacoes: Paginated<WinxApi['Transformacao']>;
  };
};

export type Paginated<T> = {
  dados: T[];
  paginacao: {
    total: number;
    pagina: number;
    totalPaginas: number;
    itensPorPagina: number;
    temProxima: boolean;
    temAnterior: boolean;
  };
};
