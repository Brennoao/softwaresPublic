import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "api_cache:";

export async function getCachedResponse<T>(endpoint: string): Promise<T | undefined> {
  const raw = await AsyncStorage.getItem(PREFIX + endpoint);
  if (!raw) return undefined;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function setCachedResponse(endpoint: string, data: unknown) {
  await AsyncStorage.setItem(PREFIX + endpoint, JSON.stringify(data));
}

export async function clearApiCache() {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((key) => key.startsWith(PREFIX));
  await AsyncStorage.multiRemove(cacheKeys);
}
