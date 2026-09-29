import { router } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { Card, CardMedia } from "@/components/ui/Card";
import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import { shuffle } from "@/lib/shuffle";
import type { Paginated, WinxApi } from "@/types/winx-api";

export default function FeaturedCharacter() {
  const Brand = useBrand();
  const { data } = useApi<Paginated<WinxApi["Personagem"]>>("/personagens");
  const [destaque, setDestaque] = useState<WinxApi["Personagem"]>();

  useEffect(() => {
    if (data && !destaque) {
      setDestaque(shuffle(data.dados)[0]);
    }
  }, [data, destaque]);

  return (
    <Card
      colors={["rgba(255,255,255,0.72)", "rgba(255,255,255,0.72)"]}
      className="mt-6 mx-2 relative"
      onPress={() =>
        destaque &&
        router.push({
          pathname: "/personagem/[id]",
          params: { id: destaque.id, nome: destaque.nome },
        })
      }
    >
      <CardMedia
        source={destaque?.imagemUrl}
        className="h-52 border-2 border-primary/60"
      />

      <View className="absolute inset-x-0 top-0 flex-row items-center justify-end p-3">
        <View className="flex-row items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full">
          <Icon name="sparkles" size={12} tintColor={Brand.accent} />
          <Text className="text-white text-xs font-bold">Em destaque</Text>
        </View>
      </View>

      <View className="absolute inset-x-0 bottom-0 p-4">
        <Text
          className="font-extrabold text-white text-2xl"
          style={{
            textShadowColor: "black",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          }}
        >
          {destaque?.nome}
        </Text>
        <Text
          className="font-bold text-accent"
          style={{
            textShadowColor: "black",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          }}
        >
          {destaque?.tituloFada}
        </Text>
      </View>
    </Card>
  );
}
