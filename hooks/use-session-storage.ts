// use-session-storage.ts
import { signal } from "../core/signal";
import type { ReadFn } from "../core/signal";

export type SessionStorageHook<T> = [
  value: ReadFn<T>,
  setValue: (next: T) => void,
  remove: () => void,
];

export function useSessionStorage<T>(
  key: string,
  initial: T,
): SessionStorageHook<T> {
  // Resolve initial value from sessionStorage or fallback
  let start = initial;

  try {
    const raw = sessionStorage.getItem(key);
    if (raw !== null) {
      start = JSON.parse(raw);
    }
  } catch (err) {
    console.error(`[useSessionStorage] Failed to read key "${key}"`, err);
  }

  const [value, write] = signal<T>(start);

  function setValue(next: T) {
    try {
      sessionStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.error(`[useSessionStorage] Failed to write key "${key}"`, err);
    }
    write(() => next);
  }

  function remove() {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error(`[useSessionStorage] Failed to remove key "${key}"`, err);
    }
    write(() => initial);
  }

  return [value, setValue, remove];
}
