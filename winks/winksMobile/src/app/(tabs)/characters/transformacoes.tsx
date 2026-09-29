import { EntityList } from "@/components/EntityList";
import type { WinxApi } from "@/types/winx-api";

export default function TransformacoesScreen() {
  return (
    <EntityList<WinxApi["Transformacao"]>
      endpoint="/transformacoes"
      routeName="transformacao"
      getId={(item) => item.id}
      getTitle={(item) => item.nome}
      getImagem={(item) => item.imagemUrl}
    />
  );
}
