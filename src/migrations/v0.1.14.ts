import { StorageKey, removeFromStorage } from '../services/storage.service';

export async function migrateUp_0_1_14() {
  // Remove old auth data
  removeFromStorage('auth' as StorageKey);
}
