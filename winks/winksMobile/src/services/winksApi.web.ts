import localApi from "@/lib/local-api";

/**
 * Versão web de `winksApi`: sem servidor pra falar com `localhost`, os dados
 * vêm embutidos no build (ver `src/lib/local-api.ts`). O Metro troca por
 * este arquivo automaticamente ao empacotar pra web — nenhum outro arquivo
 * do app precisa saber disso, todos continuam chamando `winksApi.get(...)`.
 */
export default localApi;
