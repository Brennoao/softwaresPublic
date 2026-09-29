import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoriteRouteName = "personagem" | "vilao" | "secundario" | "transformacao" | "temporada";

export type FavoriteItem = {
  id: string;
  tipo: FavoriteRouteName;
  nome: string;
  imagemUrl: string | null;
};

export type FavoritesDisplay = "ambos" | "home" | "drawer";

const FAVORITES_KEY = "favorites";
const DISPLAY_KEY = "favorites_display";

export async function getFavorites(): Promise<FavoriteItem[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

export async function setFavorites(favorites: FavoriteItem[]) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export async function getFavoritesDisplay(): Promise<FavoritesDisplay> {
  const stored = await AsyncStorage.getItem(DISPLAY_KEY);
  if (stored === "home" || stored === "drawer" || stored === "ambos") return stored;
  return "ambos";
}

export async function setFavoritesDisplay(display: FavoritesDisplay) {
  await AsyncStorage.setItem(DISPLAY_KEY, display);
}

export async function clearFavorites() {
  await AsyncStorage.multiRemove([FAVORITES_KEY, DISPLAY_KEY]);
}
