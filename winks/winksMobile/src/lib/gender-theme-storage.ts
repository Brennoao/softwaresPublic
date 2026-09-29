import * as SecureStore from 'expo-secure-store';

import type { Gender } from '@/constants/theme';

const STORAGE_KEY = 'gender_theme';

export async function getGenderTheme(): Promise<Gender> {
  const stored = await SecureStore.getItemAsync(STORAGE_KEY);
  return stored === 'masculino' ? 'masculino' : 'feminino';
}

export async function setGenderTheme(gender: Gender) {
  await SecureStore.setItemAsync(STORAGE_KEY, gender);
}
