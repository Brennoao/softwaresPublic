import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { FavoriteButton } from "@/components/FavoriteButton";
import { useBrand } from "@/context/gender-theme";
import type { FavoriteItem } from "@/lib/favorites-storage";

const BANNER_HEIGHT = 180;
const AVATAR_SIZE = 88;

type EntityHeroProps = {
  bannerUrl?: string | null;

  imagemUrl?: string | null;
  nome: string;
  subtitulo?: string | null;

  favorite?: FavoriteItem;
};

export function EntityHero({ bannerUrl, imagemUrl, nome, subtitulo, favorite }: EntityHeroProps) {
  const Brand = useBrand();

  return (
    <View>
      <LinearGradient
        colors={[Brand.primary, Brand.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: "100%", height: BANNER_HEIGHT }}
      >
        {bannerUrl && (
          <Image
            source={bannerUrl}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {favorite && (
          <View className="absolute right-3 top-3">
            <FavoriteButton item={favorite} />
          </View>
        )}
      </LinearGradient>

      <View
        className="mx-4 flex-row items-start gap-3"
        style={{ marginTop: imagemUrl ? -AVATAR_SIZE / 2 : 16 }}
      >
        {imagemUrl && (
          <View
            className="overflow-hidden rounded-full border-4 border-white"
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              shadowColor: Brand.primary,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Image
              source={imagemUrl}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}

        <View
          className="flex-1"
          style={{ paddingTop: imagemUrl ? AVATAR_SIZE / 2 + 6 : 0 }}
        >
          <Text className="text-3xl font-extrabold text-[#2B0A22] dark:text-white">{nome}</Text>
          {subtitulo && (
            <Text className="text-base font-semibold text-primary">{subtitulo}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
