import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return React.useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: any) {  
  const serializedValue = JSON.stringify(value); // Serializa el objeto a JSON
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    try {
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en AsyncStorage:', error);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      try {        
        const storedValue = localStorage.getItem(key);        
        setState(storedValue ? JSON.parse(storedValue) : null);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      AsyncStorage.getItem(key).then(value => {
        setState(value ? JSON.parse(value) : null);
      });
    }
  }, [key]);

  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );
  
  return [state, setValue];
}
