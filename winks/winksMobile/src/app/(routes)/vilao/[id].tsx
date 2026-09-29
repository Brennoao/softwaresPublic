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

function Chip({ label }: { label: string }) {
  return (
    <View className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1">
      <Text className={`text-sm ${TEXT}`}>{label}</Text>
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

export default function VilaoScreen() {
  const Brand = useBrand();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: vilao } = useApi<WinxApi["Vilao"]>(`/viloes/${id}`);

  if (!vilao) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-12">
      <EntityHero
        bannerUrl={vilao.bannerUrl}
        imagemUrl={vilao.imagemUrl}
        nome={vilao.nome}
        subtitulo={[vilao.grupo, vilao.tipo].filter(Boolean).join(" • ") || null}
        favorite={{ id: vilao.id, tipo: "vilao", nome: vilao.nome, imagemUrl: vilao.imagemUrl }}
      />

      <Section title="Sobre">
        <Text className={`leading-6 ${TEXT}`}>{vilao.biografia}</Text>
      </Section>

      {vilao.personalidade && (
        <Section title="Personalidade">
          <View className="flex-row flex-wrap gap-2">
            {vilao.personalidade.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </View>
        </Section>
      )}

      {vilao.poderes && (
        <Section title="Poderes">
          <View className={`gap-2 ${SURFACE}`}>
            {vilao.poderes.map((poder) => (
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
          <Row label="Objetivo" value={vilao.objetivo} />
          <Row label="Como foi derrotada" value={vilao.comoEDerrotada} />
          {vilao.origem && <Row label="Origem" value={vilao.origem} />}
          <Row label="Temporadas" value={vilao.temporadas.join(", ")} />
        </View>
      </Section>
    </ScrollView>
  );
}
