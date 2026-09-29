import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'auth_biometric_enabled';

export async function getBiometricAuthEnabled() {
  const stored = await SecureStore.getItemAsync(STORAGE_KEY);
  return stored === 'true';
}

export async function setBiometricAuthEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(STORAGE_KEY, String(enabled));
}
