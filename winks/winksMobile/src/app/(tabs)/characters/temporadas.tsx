import { EntityList } from "@/components/EntityList";
import type { WinxApi } from "@/types/winx-api";

export default function TemporadasScreen() {
  return (
    <EntityList<WinxApi["Temporada"]>
      endpoint="/temporadas"
      routeName="temporada"
      extractItems={(data) => data}
      getId={(item) => String(item.numero)}
      getTitle={(item) => `Temporada ${item.numero}`}
      getImagem={(item) => item.bannerUrl}
    />
  );
}
