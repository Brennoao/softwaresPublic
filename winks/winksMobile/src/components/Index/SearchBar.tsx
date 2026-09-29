import { router } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useBrand } from "@/context/gender-theme";
import winksApi from "@/services/winksApi";
import type { WinxApi } from "@/types/winx-api";

type RouteName = "personagem" | "vilao" | "secundario" | "transformacao";

type Resultado = {
  id: string;
  nome: string;
  tipo: string;
  routeName: RouteName;
};

const DEBOUNCE_MS = 400;
const MAX_RESULTADOS = 8;

function toResultados(busca: WinxApi["BuscaResultado"]): Resultado[] {
  return [
    ...busca.personagens.map((p) => ({
      id: p.id,
      nome: p.nome,
      tipo: "Fada",
      routeName: "personagem" as const,
    })),
    ...busca.viloes.map((v) => ({
      id: v.id,
      nome: v.nome,
      tipo: "Vilão",
      routeName: "vilao" as const,
    })),
    ...busca.secundarios.map((s) => ({
      id: s.id,
      nome: s.nome,
      tipo: "Secundário",
      routeName: "secundario" as const,
    })),
    ...busca.transformacoes.map((t) => ({
      id: t.id,
      nome: t.nome,
      tipo: "Transformação",
      routeName: "transformacao" as const,
    })),
  ].slice(0, MAX_RESULTADOS);
}

export function SearchBar() {
  const Brand = useBrand();
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>();
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const termo = query.trim();

    if (!termo) {
      setResultados(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    const id = ++requestId.current;

    const timeout = setTimeout(async () => {
      const api = await winksApi.get(`/busca?q=${encodeURIComponent(termo)}`);
      if (id !== requestId.current) return;

      setResultados(toResultados(api.data));
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  function selecionar(item: Resultado) {
    setQuery("");
    setResultados(undefined);
    router.push({
      pathname: `/${item.routeName}/[id]`,
      params: { id: item.id, nome: item.nome },
    });
  }

  const mostrarDropdown = query.trim().length > 0;

  return (
    <View className="relative mx-2" style={{ zIndex: 10 }}>
      <View className="justify-center">
        <TextInput
          value={query}
          onChangeText={setQuery}
          className="h-14 bg-white rounded-full pl-11 pr-4 border border-primary/40"
          placeholder="Buscar personagem, vilã, temporada…"
          placeholderTextColor="#B98AA8"
          style={{
            shadowColor: Brand.primary,
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        />
        <Icon
          name="magnifyingglass"
          size={18}
          tintColor={Brand.primary}
          className="absolute left-4"
        />
      </View>

      {mostrarDropdown && (
        <View
          className="absolute left-0 right-0 top-16 bg-white rounded-2xl border border-primary/20 overflow-hidden"
          style={{
            shadowColor: Brand.primary,
            shadowOpacity: 0.2,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          {loading && (
            <View className="p-4 items-center">
              <ActivityIndicator color={Brand.primary} />
            </View>
          )}

          {!loading && resultados?.length === 0 && (
            <Text className="p-4 text-[#8A5A78]">Nada encontrado.</Text>
          )}

          {!loading && resultados && resultados.length > 0 && (
            <ScrollView style={{ maxHeight: 280 }} keyboardShouldPersistTaps="handled">
              {resultados.map((item) => (
                <Pressable
                  key={`${item.routeName}-${item.id}`}
                  onPress={() => selecionar(item)}
                  className="flex-row items-center justify-between px-4 py-3 border-b border-primary/10 active:bg-primary/5"
                >
                  <Text className="text-[#2B0A22] font-semibold">{item.nome}</Text>
                  <Text className="text-xs text-[#8A5A78] uppercase">{item.tipo}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
