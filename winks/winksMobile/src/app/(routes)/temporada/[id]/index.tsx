import { router, useLocalSearchParams } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className={`flex-1 ${SURFACE}`}>
      <Text className={`text-xs uppercase ${MUTED}`}>{label}</Text>
      <Text className={`mt-1 font-semibold ${TEXT}`}>{value}</Text>
    </View>
  );
}

export default function TemporadaScreen() {
  const Brand = useBrand();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: temporada } = useApi<WinxApi["TemporadaDetalhe"]>(`/temporadas/${id}`);

  if (!temporada) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="pb-12">
      <EntityHero
        bannerUrl={temporada.bannerUrl}
        nome={`Temporada ${temporada.numero}`}
        subtitulo={`Estreou em ${temporada.anoEstreia}`}
        favorite={{
          id: String(temporada.numero),
          tipo: "temporada",
          nome: `Temporada ${temporada.numero}`,
          imagemUrl: temporada.bannerUrl,
        }}
      />

      <View className="mx-4 mt-5 flex-row gap-3">
        <Fact label="Episódios" value={String(temporada.totalEpisodios)} />
        <Fact label="Transformação" value={temporada.transformacaoIntroduzida} />
      </View>

      <Section title="Sobre">
        <Text className={`leading-6 ${TEXT}`}>{temporada.sinopse}</Text>
      </Section>

      {temporada.principaisViloes.length > 0 && (
        <Section title="Principais vilões">
          <View className="flex-row flex-wrap gap-2">
            {temporada.principaisViloes.map((vilao) => (
              <Chip key={vilao} label={vilao} />
            ))}
          </View>
        </Section>
      )}

      <Section title="Episódios">
        <View className={`gap-1 ${SURFACE}`}>
          {temporada.episodios.map((episodio, index) => (
            <Pressable
              key={episodio.numero}
              className={`flex-row items-center justify-between gap-3 py-3 active:opacity-60 ${
                index < temporada.episodios.length - 1 ? "border-b border-primary/10" : ""
              }`}
              onPress={() =>
                router.push({
                  pathname: "/temporada/[id]/episodio/[numero]",
                  params: {
                    id: String(temporada.numero),
                    numero: String(episodio.numero),
                    titulo: episodio.titulo,
                  },
                })
              }
            >
              <View className="flex-1">
                <Text className={`text-xs uppercase ${MUTED}`}>
                  Episódio {episodio.numero}
                </Text>
                <Text className={`font-semibold ${TEXT}`}>{episodio.titulo}</Text>
              </View>
              <Icon name="chevron.right" size={14} tintColor={Brand.primary} />
            </Pressable>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}
