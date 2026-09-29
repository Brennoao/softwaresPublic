import { Drawer } from "expo-router/drawer";
import { Platform } from "react-native";
import { Icon } from "@/components/ui/Icon";

import { useFavorites } from "@/context/favorites";
import { useBrand } from "@/context/gender-theme";

export default function CategoriasLayout() {
  const Brand = useBrand();
  const { display: favoritesDisplay } = useFavorites();
  const showFavoritesInDrawer = favoritesDisplay === "ambos" || favoritesDisplay === "drawer";

  return (
    <Drawer
      screenOptions={{
        headerTintColor: "#ffffff",
        headerStyle: { backgroundColor: Brand.primary },
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        drawerActiveTintColor: Brand.primary,
        drawerInactiveTintColor: "#8A5A78",
        drawerActiveBackgroundColor: `${Brand.primary}1A`,
        // Mesmo motivo do (tabs)/_layout.tsx: na web, telas inativas do
        // drawer ficam empilhadas por z-index (não somem de verdade), e sem
        // fundo opaco aqui a tela de trás vaza por cima da ativa.
        sceneStyle: Platform.OS === "web" ? { backgroundColor: "#FFF5FB" } : undefined,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Fadas Principais",
          drawerLabel: "Fadas Principais",
          drawerIcon: ({ color, size }) => (
            <Icon name="sparkles" size={size} tintColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          drawerItemStyle: showFavoritesInDrawer ? undefined : { height: 0 },
          drawerIcon: ({ color, size }) => (
            <Icon name="heart.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="viloes"
        options={{
          title: "Vilões",
          drawerIcon: ({ color, size }) => (
            <Icon name="flame.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="secundarios"
        options={{
          title: "Secundários",
          drawerIcon: ({ color, size }) => (
            <Icon name="person.2.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="transformacoes"
        options={{
          title: "Transformações",
          drawerIcon: ({ color, size }) => (
            <Icon name="wand.and.stars" size={size} tintColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="temporadas"
        options={{
          title: "Temporadas",
          drawerIcon: ({ color, size }) => (
            <Icon name="tv" size={size} tintColor={color} />
          ),
        }}
      />
    </Drawer>
  );
}
