import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function clear(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    Alert.alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    Alert.alert('No values stored under that key.');
  }
}
