import { Image } from "expo-image";
import { router } from "expo-router";
import { type SFSymbol } from "expo-symbols";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import { shuffle } from "@/lib/shuffle";

import { Card, CardFooter } from "../ui/Card";
import { SectionTitle } from "../ui/SectionTitle";

type RouteName =
  | "personagem"
  | "vilao"
  | "secundario"
  | "transformacao"
  | "temporada";

const VISIBLE_CARDS = 4;
const CONTAINER_PADDING = 16;
const CARD_GAP = 10;
const CARD_HEIGHT = 120;

function EntityPhoto({ source }: { source: string | null }) {
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
    <Image
      source={source}
      contentFit="cover"
      style={{ width: "100%", height: CARD_HEIGHT }}
    />
  );
}

type EntityCarouselProps<T> = {
  title: string;
  icon?: SFSymbol;

  endpoint: string;

  routeName: RouteName;
  getId: (item: T) => string;
  getNome: (item: T) => string;
  getImagem: (item: T) => string | null;

  extractItems?: (data: any) => T[];

  shuffleItems?: boolean;

  limit?: number;

  cardWidth?: number;
};

export function EntityCarousel<T>({
  title,
  icon,
  endpoint,
  routeName,
  getId,
  getNome,
  getImagem,
  extractItems = (data) => data.dados,
  shuffleItems = true,
  limit = VISIBLE_CARDS,
  cardWidth: fixedCardWidth,
}: EntityCarouselProps<T>) {
  const { data } = useApi<any>(endpoint);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth =
    fixedCardWidth ??
    (containerWidth - CONTAINER_PADDING - CARD_GAP * (limit - 1)) / limit;

  const items = useMemo(() => {
    if (!data) return undefined;
    const lista = extractItems(data);
    return (shuffleItems ? shuffle<T>(lista) : lista).slice(0, limit);
  }, [data]);

  return (
    <View
      className="px-2 mt-8"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <SectionTitle icon={icon} title={title} />

      <FlatList
        data={items}
        horizontal
        scrollEnabled={!!fixedCardWidth}
        keyExtractor={getId}
        contentContainerClassName="gap-3 pt-3"
        renderItem={({ item }) => (
          <Card
            radius="rounded-2xl"
            style={{ width: cardWidth }}
            onPress={() =>
              router.push({
                pathname: `/${routeName}/[id]`,
                params: { id: getId(item), nome: getNome(item) },
              })
            }
          >
            <EntityPhoto source={getImagem(item)} />

            <CardFooter overlay={false} className="p-2">
              <Text
                numberOfLines={1}
                className="text-xs font-bold text-white"
                style={{ textShadowColor: "black", textShadowRadius: 3 }}
              >
                {getNome(item)}
              </Text>
            </CardFooter>
          </Card>
        )}
      />
    </View>
  );
}
