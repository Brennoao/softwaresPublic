import { EntityList } from "@/components/EntityList";
import type { WinxApi } from "@/types/winx-api";

export default function VilõesScreen() {
  return (
    <EntityList<WinxApi["Vilao"]>
      endpoint="/viloes"
      routeName="vilao"
      getId={(item) => item.id}
      getTitle={(item) => item.nome}
      getImagem={(item) => item.imagemUrl}
    />
  );
}
