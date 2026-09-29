import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * expo-secure-store não tem implementação de verdade na web. A biometria em
 * si já não roda lá (expo-local-authentication não suporta), mas a tela de
 * Configurações ainda lê essa preferência salva — então precisa de algo que
 * funcione, mesmo que o valor nunca chegue a importar na prática.
 */
const STORAGE_KEY = 'auth_biometric_enabled';

export async function getBiometricAuthEnabled() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored === 'true';
}

export async function setBiometricAuthEnabled(enabled: boolean) {
  await AsyncStorage.setItem(STORAGE_KEY, String(enabled));
}
