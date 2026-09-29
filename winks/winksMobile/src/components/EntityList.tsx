import { router } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
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
import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import type { FavoriteRouteName } from "@/lib/favorites-storage";

function EntityMedia({ source }: { source: string | null }) {
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

type EntityListProps<T> = {
  endpoint: string;

  routeName: FavoriteRouteName;
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  getImagem: (item: T) => string | null;

  extractItems?: (data: any) => T[];
};

export function EntityList<T>({
  endpoint,
  routeName,
  getId,
  getTitle,
  getImagem,
  extractItems = (data) => data.dados,
}: EntityListProps<T>) {
  const Brand = useBrand();
  const { data } = useApi<any>(endpoint);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const items = useMemo(() => {
    if (!data) return [];
    const lista = [...extractItems(data)];
    lista.sort((a, b) => getTitle(a).localeCompare(getTitle(b), "pt-BR"));
    if (sortDir === "desc") lista.reverse();
    return lista;
  }, [data, sortDir]);

  return (
    <FlatList
      data={items}
      keyExtractor={getId}
      contentContainerClassName="gap-2 px-2"
      className="pt-2"
      ListHeaderComponent={
        <Pressable
          onPress={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="mb-2 flex-row items-center gap-1 self-end rounded-full border border-primary/30 bg-white/60 px-3 py-1.5"
        >
          <Icon
            name={sortDir === "asc" ? "arrow.up" : "arrow.down"}
            size={12}
            tintColor={Brand.primary}
          />
          <Text className="text-xs font-semibold text-primary">
            {sortDir === "asc" ? "A → Z" : "Z → A"}
          </Text>
        </Pressable>
      }
      renderItem={({ item }) => (
        <Card
          onPress={() =>
            router.push({
              pathname: `/${routeName}/[id]`,
              params: { id: getId(item), nome: getTitle(item) },
            })
          }
        >
          <EntityMedia source={getImagem(item)} />
          <View className="absolute left-3 top-3">
            <FavoriteButton
              item={{
                id: getId(item),
                tipo: routeName,
                nome: getTitle(item),
                imagemUrl: getImagem(item),
              }}
            />
          </View>
          <CardBadge />
          <CardFooter>
            <CardTitle>{getTitle(item)}</CardTitle>
            <CardAction>
              <Icon name="arrow.right" size={20} tintColor="#ffffff" />
            </CardAction>
          </CardFooter>
        </Card>
      )}
    />
  );
}
