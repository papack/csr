// use-local-storage.ts
import { signal } from "../core/signal";
import type { ReadFn } from "../core/signal";

export type LocalStorageHook<T> = [
  value: ReadFn<T>,
  setValue: (next: T) => void,
  remove: () => void,
];

export function useLocalStorage<T>(
  key: string,
  initial: T,
): LocalStorageHook<T> {
  // Resolve initial value from localStorage or fallback
  let start = initial;

  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      start = JSON.parse(raw);
    }
  } catch (err) {
    console.error(`[useLocalStorage] Failed to read key "${key}"`, err);
  }

  const [value, write] = signal<T>(start);

  // Update both signal and localStorage
  function setValue(next: T) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.error(`[useLocalStorage] Failed to write key "${key}"`, err);
    }
    write(() => next);
  }

  // Remove from storage and reset signal
  function remove() {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[useLocalStorage] Failed to remove key "${key}"`, err);
    }
    write(() => initial);
  }

  return [value, setValue, remove];
}
