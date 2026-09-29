import { router } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import {
  Card,
  CardAction,
  CardBadge,
  CardFooter,
  CardMedia,
  CardTitle,
} from "@/components/ui/Card";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useBrand } from "@/context/gender-theme";
import { useFavorites } from "@/context/favorites";
import type { FavoriteItem } from "@/lib/favorites-storage";

function FavoriteMedia({ source }: { source: string | null }) {
  const Brand = useBrand();

  if (!source) {
    return (
      <View
        className="h-60 w-full items-center justify-center rounded-3xl"
        style={{ backgroundColor: `${Brand.secondary}33` }}
      >
        <Icon name="sparkles" size={32} tintColor="rgba(255,255,255,0.6)" />
      </View>
    );
  }

  return <CardMedia source={source} className="h-60" />;
}

export default function FavoritosScreen() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-3 p-8">
        <Icon name="heart" size={48} tintColor="rgba(0,0,0,0.2)" />
        <Text className="text-center text-base text-[#8A5A78] dark:text-[#C9A8C4]">
          Você ainda não favoritou nada.{"\n"}Toque no coraçãozinho em qualquer fada, vilão,
          secundário, transformação ou temporada.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item: FavoriteItem) => `${item.tipo}-${item.id}`}
      contentContainerClassName="gap-2 px-2"
      className="pt-2"
      renderItem={({ item }) => (
        <Card
          onPress={() =>
            router.push({
              pathname: `/${item.tipo}/[id]`,
              params: { id: item.id, nome: item.nome },
            })
          }
        >
          <FavoriteMedia source={item.imagemUrl} />
          <View className="absolute left-3 top-3">
            <FavoriteButton item={item} />
          </View>
          <CardBadge />
          <CardFooter>
            <CardTitle>{item.nome}</CardTitle>
            <CardAction>
              <Icon name="arrow.right" size={20} tintColor="#ffffff" />
            </CardAction>
          </CardFooter>
        </Card>
      )}
    />
  );
}
