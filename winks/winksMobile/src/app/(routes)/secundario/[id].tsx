import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { EntityHero } from "@/components/EntityHero";
import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import type { WinxApi } from "@/types/winx-api";

const TEXT = "text-[#2B0A22] dark:text-white";
const MUTED = "text-[#8A5A78] dark:text-[#C9A8C4]";
const SURFACE = "rounded-2xl border border-primary/30 bg-white/70 p-4 dark:bg-white/10";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mx-4 mt-6">
      <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-4 border-b border-primary/20 py-2">
      <Text className={`shrink-0 ${MUTED}`}>{label}</Text>
      <Text className={`flex-1 text-right ${TEXT}`}>{value}</Text>
    </View>
  );
}

export default function SecundarioScreen() {
  const Brand = useBrand();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: secundario } = useApi<WinxApi["Secundario"]>(`/secundarios/${id}`);

  if (!secundario) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-12">
      <EntityHero
        bannerUrl={secundario.bannerUrl}
        imagemUrl={secundario.imagemUrl}
        nome={secundario.nome}
        subtitulo={secundario.papel}
        favorite={{
          id: secundario.id,
          tipo: "secundario",
          nome: secundario.nome,
          imagemUrl: secundario.imagemUrl,
        }}
      />

      <Section title="Sobre">
        <Text className={`leading-6 ${TEXT}`}>{secundario.biografia}</Text>
      </Section>

      {secundario.poderes && (
        <Section title="Poderes">
          <View className={`gap-2 ${SURFACE}`}>
            {secundario.poderes.map((poder) => (
              <View key={poder} className="flex-row gap-2">
                <Text className="text-accent">✦</Text>
                <Text className={`flex-1 ${TEXT}`}>{poder}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      <Section title="Curiosidades">
        <View className={SURFACE}>
          <Row label="Escola/Local" value={secundario.escolaOuLocal} />
          <Row label="Relação com a Winx" value={secundario.relacaoComWinx} />
        </View>
      </Section>
    </ScrollView>
  );
}
