import { EntityList } from "@/components/EntityList";
import type { WinxApi } from "@/types/winx-api";

export default function SecundariosScreen() {
  return (
    <EntityList<WinxApi["Secundario"]>
      endpoint="/secundarios"
      routeName="secundario"
      getId={(item) => item.id}
      getTitle={(item) => item.nome}
      getImagem={(item) => item.imagemUrl}
    />
  );
}
