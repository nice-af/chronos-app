import { StorageKey, removeFromStorage } from '../services/storage.service';

export function migrateUp_0_1_14() {
  // Remove old auth data
  void removeFromStorage('auth' as StorageKey);
}
