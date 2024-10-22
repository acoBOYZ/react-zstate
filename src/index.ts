import { create } from 'zustand';
import { useEffect, useCallback } from 'react';

const hashKey = (key: string | string[]): string => {
  const strKey = typeof key === 'string' ? key : key.join('|');

  let hash = 5381;
  for (let i = 0; i < strKey.length; i++) {
    const char = strKey.charCodeAt(i);
    hash = (hash * 33) ^ char;
  }
  return (hash >>> 0).toString(36);
};

type StateStore = {
  [key: string]: any;
};

type Actions = {
  setState: (key: string | string[], updater: any) => void;
  resetState: (key: string | string[]) => void;
  setInitialData: (key: string | string[], data: any) => void;
};

const useGlobalStore = create<StateStore & Actions>((set) => ({
  setState: (key, updater) => {
    const hashedKey = hashKey(key);
    set((state) => {
      const prevState = state[hashedKey];
      const newState =
        typeof updater === 'function' ? updater(prevState) : updater;
      return { ...state, [hashedKey]: newState };
    });
  },
  resetState: (key) => {
    const hashedKey = hashKey(key);
    set((state) => {
      const initialData = state[`__initial_${hashedKey}`];
      return { ...state, [hashedKey]: initialData };
    });
  },
  setInitialData: (key, data) => {
    const hashedKey = hashKey(key);
    set((state) => ({
      ...state,
      [hashedKey]: data,
      [`__initial_${hashedKey}`]: data,
    }));
  },
}));

/**
 * Custom hook for managing state with Zustand without serialization.
 *
 * @template T - The type of the state data.
 * @param {string | string[]} key - The unique key for the state.
 * @param {T} initialData - The initial data for the state.
 * @returns {[T, (data: T | ((prevState: T) => T)) => void, () => void]}
 *   - The current state, a function to update the state, and a function to reset the state.
 *
 * @example
 * // Using the hook with a string key
 * const [state, setState, resetState] = useZState<string>('myUniqueKey', 'initialValue');
 *
 * // Using the hook with an array key
 * const [state, setState, resetState] = useZState<string>(['user', 'profile'], 'initialValue');
 *
 * // Updating the state
 * setState('newValue');
 *
 * // Resetting the state
 * resetState();
 */
export function useZState<T>(
  key: string | string[],
  initialData: T
): [T, (data: T | ((prevState: T) => T)) => void, () => void] {
  const hashedKey = hashKey(key);

  // Initialize the state if it hasn't been initialized yet
  useEffect(() => {
    const store = useGlobalStore.getState();
    if (store[hashedKey] === undefined) {
      store.setInitialData(key, initialData);
    }
  }, [hashedKey, initialData]);

  // Select the state from the store
  const state = useGlobalStore(
    useCallback((state) => state[hashedKey] || initialData as T, [hashedKey, initialData])
  );

  const setState = useCallback(
    (data: T | ((prevState: T) => T)) => {
      useGlobalStore.getState().setState(key, data);
    },
    [key]
  );

  const resetState = useCallback(() => {
    useGlobalStore.getState().resetState(key);
  }, [key]);

  return [state, setState, resetState];
}