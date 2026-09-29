import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { useBrand } from "@/context/gender-theme";

export default function TabsLayout() {
  const Brand = useBrand();

  return (
    <Tabs
      screenOptions={{
        headerTintColor: "#ffffff",
        headerStyle: { backgroundColor: Brand.primary },
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: "#8A5A78",
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.4)",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.5)",
        },
        // Na web, abas inativas ficam empilhadas atrás por z-index (não some
        // de verdade como no nativo) — sem um fundo opaco aqui, a aba de trás
        // vaza por cima da ativa, já que as telas são transparentes de
        // propósito (pra mostrar o MagicBackground). No nativo isso não
        // acontece, então deixamos como estava.
        sceneStyle: Platform.OS === "web" ? { backgroundColor: "#FFF5FB" } : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="house.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="characters"
        options={{
          title: "Fadas",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="sparkles" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <Icon name="gearshape.fill" size={size} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
