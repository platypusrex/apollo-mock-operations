import { useState } from 'react';
import type { AnyObject } from '../../types';

const createMemoryStorage = (): Storage => {
  let storage: Record<string, string> = {};
  return {
    length: Object.keys(storage).length,
    clear() {
      storage = {};
    },
    removeItem(key: string) {
      delete storage[key];
    },
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    getItem(key: string): string | null {
      return storage[key] || null;
    },
    key(index: number): string | null {
      if (index >= Object.keys(storage).length) {
        return null;
      }
      return Object.keys(storage)[index];
    },
  };
};

export const getStorage = () => typeof window !== 'undefined' ? window.sessionStorage : createMemoryStorage();

export interface UseStorage<T> {
  storedValue: T;
  setStoredValue: (v: T) => void;
}

export const useStorage = <T = AnyObject>(key: string, initialValue?: T): UseStorage<T> => {
  const storage = getStorage();
  const [storedValue, setValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = (value: T | (() => T)) => {
    try {
      const valueToStore = value instanceof Function ? value() : value;
      setValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return { storedValue, setStoredValue };
};
