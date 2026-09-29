import Constants from 'expo-constants';
import { Alert, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/Icon';
import { BRAND_PALETTES, type Gender } from '@/constants/theme';
import { useApiCache } from '@/context/api-cache';
import { useFavorites } from '@/context/favorites';
import { useBrand, useGenderTheme } from '@/context/gender-theme';
import { useBiometricAuthSetting } from '@/hooks/use-biometric-auth-setting';
import { clearApiCache } from '@/lib/api-cache-storage';
import type { FavoritesDisplay } from '@/lib/favorites-storage';

const KIND_LABEL = {
  facial: 'Reconhecimento facial',
  fingerprint: 'Biometria (digital)',
  none: 'Autenticação do dispositivo',
} as const;

const GENDER_LABEL: Record<Gender, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
};

const FAVORITES_DISPLAY_LABEL: Record<FavoritesDisplay, string> = {
  ambos: 'Home + Drawer',
  home: 'Só na Home',
  drawer: 'Só no drawer',
};

const SECTION_TITLE = 'mb-1 text-xs font-semibold uppercase text-[#8A5A78] dark:text-[#C9A8C4]';
const CARD = 'rounded-xl bg-[#FFE3F1] px-4 py-4 dark:bg-[#2B1830]';

function GenderOption({
  gender,
  selected,
  onPress,
}: {
  gender: Gender;
  selected: boolean;
  onPress: () => void;
}) {
  const palette = BRAND_PALETTES[gender];

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center gap-2 rounded-xl border px-4 py-3"
      style={{
        borderColor: selected ? palette.primary : 'transparent',
        backgroundColor: selected ? `${palette.primary}1A` : 'rgba(0,0,0,0.04)',
      }}
    >
      <View className="h-4 w-4 rounded-full" style={{ backgroundColor: palette.primary }} />
      <Text className="text-base font-semibold text-[#2B0A22] dark:text-white">
        {GENDER_LABEL[gender]}
      </Text>
    </Pressable>
  );
}

function OptionPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const Brand = useBrand();

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center rounded-full border px-3 py-2"
      style={{
        borderColor: selected ? Brand.primary : 'transparent',
        backgroundColor: selected ? `${Brand.primary}1A` : 'rgba(0,0,0,0.04)',
      }}
    >
      <Text className="text-xs font-semibold text-[#2B0A22] dark:text-white">{label}</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const Brand = useBrand();
  const { loading, isSupported, kind, enabled, toggle } = useBiometricAuthSetting();
  const { gender, setGender } = useGenderTheme();
  const { favorites, display, setDisplay, resetFavorites } = useFavorites();
  const { refreshAll } = useApiCache();

  const handleToggle = async (next: boolean) => {
    const confirmed = await toggle(next);
    if (!confirmed) {
      Alert.alert(
        'Não foi possível confirmar',
        'A autenticação não foi verificada, tente novamente.'
      );
    }
  };

  const handleRefreshData = () => {
    refreshAll();
    Alert.alert('Atualizando', 'Os dados estão sendo buscados de novo na API.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpar dados salvos',
      'Isso apaga favoritos, cache offline e volta biometria/aparência pro padrão. Não afeta o catálogo em si (ele vem da API).',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            resetFavorites();
            setGender('feminino');
            if (enabled) await toggle(false);
            await clearApiCache();
            refreshAll();
            Alert.alert('Pronto', 'Dados salvos localmente foram apagados.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="gap-2 p-4 pb-10">
        <Text className={SECTION_TITLE}>Aparência</Text>

        <View className="flex-row gap-2">
          <GenderOption
            gender="feminino"
            selected={gender === 'feminino'}
            onPress={() => setGender('feminino')}
          />
          <GenderOption
            gender="masculino"
            selected={gender === 'masculino'}
            onPress={() => setGender('masculino')}
          />
        </View>

        <Text className={`mt-6 ${SECTION_TITLE}`}>Favoritos</Text>

        <View className={`gap-2 ${CARD}`}>
          <Text className="text-sm text-[#2B0A22] dark:text-white">
            {favorites.length === 0
              ? 'Nenhum favorito ainda.'
              : `${favorites.length} favorito${favorites.length > 1 ? 's' : ''} salvo${favorites.length > 1 ? 's' : ''}.`}
          </Text>
          <Text className="mb-1 text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
            Onde mostrar a lista de favoritos
          </Text>
          <View className="flex-row gap-2">
            {(Object.keys(FAVORITES_DISPLAY_LABEL) as FavoritesDisplay[]).map((option) => (
              <OptionPill
                key={option}
                label={FAVORITES_DISPLAY_LABEL[option]}
                selected={display === option}
                onPress={() => setDisplay(option)}
              />
            ))}
          </View>
        </View>

        <Text className={`mt-6 ${SECTION_TITLE}`}>Segurança</Text>

        <View className={`flex-row items-center justify-between ${CARD}`}>
          <View className="flex-1 pr-4">
            <Text className="text-base text-[#2B0A22] dark:text-white">
              {isSupported ? KIND_LABEL[kind] : 'Autenticação não disponível'}
            </Text>
            <Text className="mt-0.5 text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
              {isSupported
                ? 'Pedir biometria ou reconhecimento facial ao abrir o app.'
                : 'Configure biometria ou Face ID nas configurações do seu celular para usar essa opção.'}
            </Text>
          </View>

          <Switch
            value={enabled}
            onValueChange={handleToggle}
            disabled={!isSupported || loading}
            trackColor={{ true: Brand.primary }}
          />
        </View>

        <Text className={`mt-6 ${SECTION_TITLE}`}>Dados</Text>

        <Pressable
          onPress={handleRefreshData}
          className={`flex-row items-center justify-between ${CARD}`}
        >
          <View className="flex-1 pr-4">
            <Text className="text-base text-[#2B0A22] dark:text-white">Atualizar dados agora</Text>
            <Text className="mt-0.5 text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
              O app já mostra tudo salvo offline e atualiza sozinho quando tem internet — use
              isso pra forçar uma atualização na hora.
            </Text>
          </View>
          <Icon name="arrow.clockwise" size={20} tintColor={Brand.primary} />
        </Pressable>

        <Pressable
          onPress={handleClearData}
          className={`mt-2 flex-row items-center justify-between ${CARD}`}
        >
          <View className="flex-1 pr-4">
            <Text className="text-base text-[#2B0A22] dark:text-white">Limpar dados salvos</Text>
            <Text className="mt-0.5 text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
              Apaga favoritos, cache offline e reseta as preferências do app.
            </Text>
          </View>
          <Icon name="trash" size={20} tintColor={Brand.primary} />
        </Pressable>

        <Text className={`mt-6 ${SECTION_TITLE}`}>Sobre</Text>

        <View className={`gap-1 ${CARD}`}>
          <Text className="text-base font-semibold text-[#2B0A22] dark:text-white">
            {Constants.expoConfig?.name ?? 'Winks'}
          </Text>
          <Text className="text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
            Versão {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
          <Text className="mt-2 text-xs text-[#8A5A78] dark:text-[#C9A8C4]">
            App de fã feito com a API local do universo Winx Club. Fotos e banners vêm do{' '}
            <Text
              className="font-semibold text-primary"
              onPress={() => Linking.openURL('https://winx.fandom.com')}
            >
              Winx Club Wiki (Fandom)
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
