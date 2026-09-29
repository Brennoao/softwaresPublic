import { type SFSymbol } from "expo-symbols";
import { Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/context/api-cache";
import { useFavorites } from "@/context/favorites";
import { useBrand } from "@/context/gender-theme";
import type { WinxApi } from "@/types/winx-api";

import { EntityCarousel } from "@/components/Index/EntityCarousel";
import FeaturedCharacter from "@/components/Index/FeaturedCharacter";
import { FavoritesCarousel } from "@/components/Index/FavoritesCarousel";
import { SearchBar } from "@/components/Index/SearchBar";
import { StatCard } from "@/components/Index/StatCard";

export default function HomeScreen() {
  const Brand = useBrand();
  const { data: stats } = useApi<WinxApi["Stats"]>("/stats");
  const { display: favoritesDisplay } = useFavorites();

  const STATS: Record<
    keyof WinxApi["Stats"],
    { label: string; icon: SFSymbol; color: string }
  > = {
    personagens: { label: "Fadas", icon: "sparkles", color: Brand.primary },
    viloes: { label: "Vilões", icon: "flame.fill", color: Brand.secondary },
    secundarios: { label: "Secundários", icon: "person.2.fill", color: "#B8860A" },
    transformacoes: { label: "Transformações", icon: "wand.and.stars", color: Brand.primary },
    temporadas: { label: "Temporadas", icon: "tv", color: Brand.secondary },
    episodios: { label: "Episódios", icon: "play.circle.fill", color: "#B8860A" },
  };

  const statsArray = stats
    ? (Object.keys(STATS) as (keyof WinxApi["Stats"])[]).map((key) => ({
        key,
        value: stats[key],
        ...STATS[key],
      }))
    : [];

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-10">
      <View className="flex-row items-center gap-3 mx-4 mt-20">
        <View
          className="size-11 items-center justify-center rounded-full"
          style={{
            backgroundColor: Brand.primary,
            shadowColor: Brand.primary,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Icon name="sparkles" size={22} tintColor="white" />
        </View>

        <View>
          <Text className="text-[#2B0A22] font-extrabold text-xl">
            Bem-vinda ao Club das Winks
          </Text>
          <Text className="text-[#8A5A78] text-base">
            O universo Winx em números e fadas
          </Text>
        </View>
      </View>

      <FeaturedCharacter />

      <View className="mt-5">
        <SearchBar />
      </View>

      <View className="p-2 mt-5">
        <FlatList
          data={statsArray}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item.key}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <StatCard icon={item.icon} value={item.value} label={item.label} color={item.color} />
          )}
        />
      </View>

      {(favoritesDisplay === "ambos" || favoritesDisplay === "home") && <FavoritesCarousel />}

      <EntityCarousel<WinxApi["Personagem"]>
        title="FADAS PRINCIPAIS"
        icon="sparkles"
        endpoint="/personagens"
        routeName="personagem"
        getId={(item) => item.id}
        getNome={(item) => item.nome}
        getImagem={(item) => item.imagemUrl}
      />

      <EntityCarousel<WinxApi["Vilao"]>
        title="VILÕES PRINCIPAIS"
        icon="flame.fill"
        endpoint="/viloes"
        routeName="vilao"
        getId={(item) => item.id}
        getNome={(item) => item.nome}
        getImagem={(item) => item.imagemUrl}
      />

      <EntityCarousel<WinxApi["Secundario"]>
        title="PERSONAGENS SECUNDÁRIOS"
        icon="person.2.fill"
        endpoint="/secundarios"
        routeName="secundario"
        getId={(item) => item.id}
        getNome={(item) => item.nome}
        getImagem={(item) => item.imagemUrl}
      />

      <EntityCarousel<WinxApi["Transformacao"]>
        title="TRANSFORMAÇÕES"
        icon="wand.and.stars"
        endpoint="/transformacoes"
        routeName="transformacao"
        getId={(item) => item.id}
        getNome={(item) => item.nome}
        getImagem={(item) => item.imagemUrl}
      />

      <EntityCarousel<WinxApi["Temporada"]>
        title="TEMPORADAS"
        icon="tv"
        endpoint="/temporadas"
        routeName="temporada"
        extractItems={(data) => data}
        shuffleItems={false}
        limit={8}
        cardWidth={130}
        getId={(item) => String(item.numero)}
        getNome={(item) => `Temporada ${item.numero}`}
        getImagem={(item) => item.bannerUrl}
      />
    </ScrollView>
  );
}
