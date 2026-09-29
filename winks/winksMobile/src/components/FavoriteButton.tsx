import { Icon } from "@/components/ui/Icon";
import { Pressable, View } from "react-native";

import { useBrand } from "@/context/gender-theme";
import { useFavorites } from "@/context/favorites";
import type { FavoriteItem } from "@/lib/favorites-storage";

type FavoriteButtonProps = {
  item: FavoriteItem;

  size?: number;
};

export function FavoriteButton({ item, size = 36 }: FavoriteButtonProps) {
  const Brand = useBrand();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id, item.tipo);

  return (
    <Pressable
      onPress={() => toggleFavorite(item)}
      hitSlop={8}
      className="items-center justify-center rounded-full bg-black/25"
      style={{ width: size, height: size }}
    >
      <View>
        <Icon
          name={favorited ? "heart.fill" : "heart"}
          size={size * 0.5}
          tintColor={favorited ? Brand.accent : "#ffffff"}
        />
      </View>
    </Pressable>
  );
}
