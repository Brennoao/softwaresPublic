import "../global.css";
import "@/lib/nativewind-interop";

import { DefaultTheme, Stack, ThemeProvider, router, useNavigation } from "expo-router";
import { colorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, type ReactNode } from "react";
import { Platform, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthGate } from "@/components/auth-gate";
import { MagicBackground } from "@/components/magic-background";
import { Icon } from "@/components/ui/Icon";
import { ApiCacheProvider } from "@/context/api-cache";
import { FavoritesProvider } from "@/context/favorites";
import { GenderThemeProvider, useBrand } from "@/context/gender-theme";

SplashScreen.preventAutoHideAsync();

const LightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "transparent" },
};

const WEB_MAX_WIDTH = 430;

function WebPhoneFrame({ children }: { children: ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#1A0E1F" }}>
      <View style={{ flex: 1, width: "100%", maxWidth: WEB_MAX_WIDTH, overflow: "hidden" }}>
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    colorScheme.set("light");
  }, []);

  return (
    <WebPhoneFrame>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={LightTheme}>
          <GenderThemeProvider>
            <ApiCacheProvider>
              <FavoritesProvider>
                <AppShell />
              </FavoritesProvider>
            </ApiCacheProvider>
          </GenderThemeProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </WebPhoneFrame>
  );
}

/**
 * Volta pra tela anterior quando tem uma (navegação normal, dentro do app).
 * Sem histórico — por exemplo, um link direto pra essa página — volta pra
 * Home, em vez de não fazer nada.
 */
function BackButton() {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <Pressable
      onPress={() => (canGoBack ? navigation.goBack() : router.replace("/"))}
      hitSlop={12}
      className="pl-1 pr-3"
    >
      <Icon name="chevron.left" size={24} tintColor="#ffffff" />
    </Pressable>
  );
}

function AppShell() {
  const Brand = useBrand();

  return (
    <AuthGate>
      <View style={{ flex: 1 }}>
        <MagicBackground />

        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Brand.primary },
            headerTintColor: "#ffffff",
            headerTitleAlign: "center",
            headerLeft: () => <BackButton />,
            contentStyle: { backgroundColor: "transparent" },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(routes)/personagem/[id]"
            options={({ route }) => ({
              title:
                (route.params as { nome?: string })?.nome ?? "Personagem",
            })}

          />
          <Stack.Screen
            name="(routes)/vilao/[id]"
            options={({ route }) => ({
              title: (route.params as { nome?: string })?.nome ?? "Vilão",
            })}
          />
          <Stack.Screen
            name="(routes)/secundario/[id]"
            options={({ route }) => ({
              title:
                (route.params as { nome?: string })?.nome ?? "Secundário",
            })}
          />
          <Stack.Screen
            name="(routes)/transformacao/[id]"
            options={({ route }) => ({
              title:
                (route.params as { nome?: string })?.nome ?? "Transformação",
            })}
          />
          <Stack.Screen
            name="(routes)/temporada/[id]/index"
            options={({ route }) => ({
              title: (route.params as { nome?: string })?.nome ?? "Temporada",
            })}
          />
          <Stack.Screen
            name="(routes)/temporada/[id]/episodio/[numero]"
            options={({ route }) => ({
              title:
                (route.params as { titulo?: string })?.titulo ?? "Episódio",
            })}
          />
        </Stack>
      </View>
    </AuthGate>
  );
}
