import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKey {
  AUTH = 'auth',
  FOO = 'foo',
}

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
  cloudId: string;
}
interface FooModel {
  foo: 'bar';
}

interface StorageTypes {
  [StorageKey.AUTH]: AuthModel | null;
  [StorageKey.FOO]: FooModel;
}

export async function getFromStorage<T extends StorageKey = never>(key: T): Promise<StorageTypes[T] | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function setInStorage<T extends StorageKey = never>(key: T, value: StorageTypes[T]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeFromStorage<T extends StorageKey = never>(key: T) {
  await AsyncStorage.removeItem(key);
}
