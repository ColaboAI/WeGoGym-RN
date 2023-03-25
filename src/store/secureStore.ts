import { MMKV } from 'react-native-mmkv';
import { MMKV_ENCRYPTION_KEY } from '@env';

function initMMKV() {
  const secureStorage = new MMKV({
    id: 'mmkv-secure-store',
    encryptionKey: `${MMKV_ENCRYPTION_KEY}`,
  });

  const storage = new MMKV({ id: 'mmkv-global-store' });
  return { storage, secureStorage };
}

const { storage, secureStorage } = initMMKV();

export const mmkv = {
  getStorage: () => storage,
  setItem: (key: string, value: string | number | boolean | Uint8Array) => {
    storage.set(key, value);
  },

  getString: (key: string) => {
    return storage.getString(key);
  },

  getNumber: (key: string) => {
    return storage.getNumber(key);
  },

  getBoolean: (key: string) => {
    return storage.getBoolean(key);
  },

  getBuffer: (key: string) => {
    return storage.getBuffer(key);
  },

  recrypt: (key: string | undefined) => {
    storage.recrypt(key);
  },

  existInStore: (key: string) => {
    return storage.contains(key);
  },

  getAllKeys: () => {
    return storage.getAllKeys();
  },

  deleteAllKeys: () => {
    storage.clearAll();
  },

  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const secureMmkv = {
  getSecureStorage: () => secureStorage,
  setItem: (key: string, value: string | number | boolean | Uint8Array) => {
    secureStorage.set(key, value);
  },

  getString: (key: string) => {
    return secureStorage.getString(key);
  },

  getNumber: (key: string) => {
    return secureStorage.getNumber(key);
  },
  getBoolean: (key: string) => {
    return secureStorage.getBoolean(key);
  },
  getBuffer: (key: string) => {
    return secureStorage.getBuffer(key);
  },

  recrypt: (key: string | undefined) => {
    secureStorage.recrypt(key);
  },
  existInStore: (key: string) => {
    return secureStorage.contains(key);
  },
  getAllKeys: () => {
    return secureStorage.getAllKeys();
  },
  deleteAllKeys: () => {
    secureStorage.clearAll();
  },
  removeItem: (key: string) => {
    secureStorage.delete(key);
  },
};

function save(key: string, value: string) {
  secureMmkv.setItem(key, value);
}

function clear(key: string) {
  secureMmkv.removeItem(key);
}

function getValueFor(key: string) {
  let value = secureMmkv.getString(key);
  return value ? value : null;
}

export { save, clear, getValueFor };
