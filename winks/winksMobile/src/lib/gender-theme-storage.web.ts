import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Gender } from '@/constants/theme';

/**
 * expo-secure-store não tem implementação de verdade na web (o módulo web
 * dele é um objeto vazio). O dado aqui não é sensível — é só a preferência
 * de tema —, então AsyncStorage (localStorage por baixo) resolve bem.
 */
const STORAGE_KEY = 'gender_theme';

export async function getGenderTheme(): Promise<Gender> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored === 'masculino' ? 'masculino' : 'feminino';
}

export async function setGenderTheme(gender: Gender) {
  await AsyncStorage.setItem(STORAGE_KEY, gender);
}
