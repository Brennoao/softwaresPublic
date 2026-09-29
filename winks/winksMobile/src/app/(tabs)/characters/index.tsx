import { EntityList } from "@/components/EntityList";
import type { WinxApi } from "@/types/winx-api";

export default function FadasScreen() {
  return (
    <EntityList<WinxApi["Personagem"]>
      endpoint="/personagens"
      routeName="personagem"
      getId={(item) => item.id}
      getTitle={(item) => item.nomeCompleto ?? item.nome}
      getImagem={(item) => item.imagemUrl}
    />
  );
}
