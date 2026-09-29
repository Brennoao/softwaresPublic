import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { EntityHero } from "@/components/EntityHero";
import { useApi } from "@/context/api-cache";
import { useBrand } from "@/context/gender-theme";
import type { WinxApi } from "@/types/winx-api";

const TEXT = "text-[#2B0A22] dark:text-white";
const MUTED = "text-[#8A5A78] dark:text-[#C9A8C4]";
const SURFACE = "rounded-2xl border border-primary/30 bg-white/70 p-4 dark:bg-white/10";

const CHIP_TONES = {
  primary: "border-primary/40 bg-primary/15",
  secondary: "border-secondary/40 bg-secondary/15",
  accent: "border-accent/60 bg-accent/20",
} as const;

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

function Chip({ label, tone = "primary" }: { label: string; tone?: keyof typeof CHIP_TONES }) {
  return (
    <View className={`rounded-full border px-3 py-1 ${CHIP_TONES[tone]}`}>
      <Text className={`text-sm ${TEXT}`}>{label}</Text>
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className={`flex-1 ${SURFACE}`}>
      <Text className={`text-xs uppercase ${MUTED}`}>{label}</Text>
      <Text className={`mt-1 font-semibold ${TEXT}`}>{value}</Text>
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

export default function PersonagemScreen() {
  const Brand = useBrand();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: personagem } = useApi<WinxApi["Personagem"]>(`/personagens/${id}`);

  if (!personagem) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-12">
      <EntityHero
        bannerUrl={personagem.bannerUrl}
        imagemUrl={personagem.imagemUrl}
        nome={personagem.nome}
        subtitulo={personagem.tituloFada}
        favorite={{
          id: personagem.id,
          tipo: "personagem",
          nome: personagem.nome,
          imagemUrl: personagem.imagemUrl,
        }}
      />

      {personagem.nomeCompleto && (
        <Text className={`mx-4 mt-1 text-base ${MUTED}`}>{personagem.nomeCompleto}</Text>
      )}

      <View className="mx-4 mt-5 gap-3">
        <View className="flex-row gap-3">
          <Fact label="Planeta" value={personagem.planetaOrigem} />
          <Fact label="Aniversário" value={personagem.dataNascimento} />
        </View>
        <View className="flex-row gap-3">
          <Fact label="Cabelo" value={personagem.corCabelo} />
          <Fact label="Olhos" value={personagem.corOlhos} />
        </View>
      </View>

      <Section title="Sobre">
        <Text className={`leading-6 ${TEXT}`}>{personagem.biografia}</Text>
      </Section>

      <Section title="Personalidade">
        <View className="flex-row flex-wrap gap-2">
          {personagem.personalidade.map((item) => (
            <Chip key={item} label={item} />
          ))}
        </View>
      </Section>

      <Section title="Poderes">
        <View className={`gap-2 ${SURFACE}`}>
          {personagem.poderes.map((poder) => (
            <View key={poder} className="flex-row gap-2">
              <Text className="text-accent">✦</Text>
              <Text className={`flex-1 ${TEXT}`}>{poder}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Transformações">
        <View className="flex-row flex-wrap gap-2">
          {personagem.transformacoes.map((item) => (
            <Chip key={item} label={item} tone="secondary" />
          ))}
        </View>
      </Section>

      <Section title="Relações">
        <View className={SURFACE}>
          <Row label="Pet" value={personagem.pet} />
          {personagem.interesseAmoroso && (
            <Row label="Interesse amoroso" value={personagem.interesseAmoroso} />
          )}
          <Row label="Pais" value={personagem.familia.pais.join("\n")} />
          {personagem.familia.irmaos && (
            <Row label="Irmãos" value={personagem.familia.irmaos.join("\n")} />
          )}
        </View>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {personagem.melhoresAmigas.map((amiga) => (
            <Chip key={amiga} label={amiga} tone="accent" />
          ))}
        </View>
      </Section>

      <Section title="Curiosidades">
        <View className={SURFACE}>
          <Row label="Talento" value={personagem.talentoEspecial} />
          <Row label="Dublagem original" value={personagem.dubladorOriginal} />
          <Row label="Dublagem Brasil" value={personagem.dubladorBrasil} />
          <Row label="1ª aparição" value={personagem.primeiraAparicao} />
        </View>
      </Section>
    </ScrollView>
  );
}
