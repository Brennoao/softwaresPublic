import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import type { WinxApi } from "@/types/winx-api";

const TEXT = "text-[#2B0A22] dark:text-white";

export default function EpisodioScreen() {
  const Brand = useBrand();
  const { id, numero } = useLocalSearchParams<{ id: string; numero: string }>();
  const { data: episodio } = useApi<WinxApi["Episodio"]>(
    `/temporadas/${id}/episodios/${numero}`
  );

  if (!episodio) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-12">
      <LinearGradient
        colors={[Brand.primary, Brand.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mx-4 mt-4 flex-row items-center gap-2 self-start rounded-full px-4 py-2"
      >
        <Icon name="play.circle.fill" size={16} tintColor="white" />
        <Text className="font-bold text-white">
          Temporada {episodio.temporada} • Episódio {episodio.numero}
        </Text>
      </LinearGradient>

      <View className="mx-4 mt-5">
        <Text className={`text-3xl font-extrabold ${TEXT}`}>{episodio.titulo}</Text>
      </View>

      <View className="mx-4 mt-5">
        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
          Sinopse
        </Text>
        <Text className={`leading-6 ${TEXT}`}>{episodio.sinopse}</Text>
      </View>
    </ScrollView>
  );
}
