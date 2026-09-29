import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import {
  clearFavorites,
  getFavorites,
  getFavoritesDisplay,
  setFavorites as saveFavorites,
  setFavoritesDisplay as saveFavoritesDisplay,
  type FavoriteItem,
  type FavoritesDisplay,
} from "@/lib/favorites-storage";

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  loading: boolean;
  isFavorite: (id: string, tipo: FavoriteItem["tipo"]) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  display: FavoritesDisplay;
  setDisplay: (display: FavoritesDisplay) => void;

  resetFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavoritesState] = useState<FavoriteItem[]>([]);
  const [display, setDisplayState] = useState<FavoritesDisplay>("ambos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedFavorites, storedDisplay] = await Promise.all([
        getFavorites(),
        getFavoritesDisplay(),
      ]);
      setFavoritesState(storedFavorites);
      setDisplayState(storedDisplay);
      setLoading(false);
    })();
  }, []);

  const isFavorite = (id: string, tipo: FavoriteItem["tipo"]) =>
    favorites.some((f) => f.id === id && f.tipo === tipo);

  const toggleFavorite = (item: FavoriteItem) => {
    const next = isFavorite(item.id, item.tipo)
      ? favorites.filter((f) => !(f.id === item.id && f.tipo === item.tipo))
      : [...favorites, item];

    setFavoritesState(next);
    saveFavorites(next);
  };

  const setDisplay = (next: FavoritesDisplay) => {
    setDisplayState(next);
    saveFavoritesDisplay(next);
  };

  const resetFavorites = () => {
    setFavoritesState([]);
    setDisplayState("ambos");
    clearFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        display,
        setDisplay,
        resetFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites precisa estar dentro de um FavoritesProvider");
  return ctx;
}
