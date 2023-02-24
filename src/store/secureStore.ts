import * as SecureStore from 'expo-secure-store';

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function clear(key: string) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export { save, clear, getValueFor };
