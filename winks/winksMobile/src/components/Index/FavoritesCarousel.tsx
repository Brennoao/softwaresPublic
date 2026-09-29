import { Image } from "expo-image";
import { router } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { FavoriteButton } from "@/components/FavoriteButton";
import { Card, CardFooter } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useFavorites } from "@/context/favorites";
import { useBrand } from "@/context/gender-theme";

const VISIBLE_CARDS = 4;
const CONTAINER_PADDING = 16;
const CARD_GAP = 10;
const CARD_HEIGHT = 120;

function FavoritePhoto({ source }: { source: string | null }) {
  const Brand = useBrand();

  if (!source) {
    return (
      <View
        className="w-full items-center justify-center"
        style={{ height: CARD_HEIGHT, backgroundColor: `${Brand.secondary}33` }}
      >
        <Icon name="sparkles" size={22} tintColor="rgba(255,255,255,0.6)" />
      </View>
    );
  }

  return (
    <Image source={source} contentFit="cover" style={{ width: "100%", height: CARD_HEIGHT }} />
  );
}

export function FavoritesCarousel() {
  const { favorites } = useFavorites();
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth =
    (containerWidth - CONTAINER_PADDING - CARD_GAP * (VISIBLE_CARDS - 1)) / VISIBLE_CARDS;

  if (favorites.length === 0) return null;

  return (
    <View
      className="px-2 mt-8"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <SectionTitle icon="heart.fill" title="MEUS FAVORITOS" />

      <FlatList
        data={favorites}
        horizontal
        scrollEnabled={favorites.length > VISIBLE_CARDS}
        keyExtractor={(item) => `${item.tipo}-${item.id}`}
        contentContainerClassName="gap-3 pt-3"
        renderItem={({ item }) => (
          <Card
            radius="rounded-2xl"
            style={{ width: cardWidth }}
            onPress={() =>
              router.push({
                pathname: `/${item.tipo}/[id]`,
                params: { id: item.id, nome: item.nome },
              })
            }
          >
            <FavoritePhoto source={item.imagemUrl} />

            <View className="absolute left-2 top-2">
              <FavoriteButton item={item} size={28} />
            </View>

            <CardFooter overlay={false} className="p-2">
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-white"
                style={{ textShadowColor: "black", textShadowRadius: 3 }}
              >
                {item.nome}
              </Text>
            </CardFooter>
          </Card>
        )}
      />
    </View>
  );
}
