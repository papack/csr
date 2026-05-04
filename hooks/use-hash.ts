// use-hash.ts
import { signal, type ReadFn } from "../core/signal";

type WriteFn<T> = (value: T | ((prev: T) => T)) => void;

function getHash(): string {
  return window.location.hash || "";
}

// initial value from URL
const [hash, write] = signal<string>(getHash());

// keep in sync with browser navigation
window.addEventListener("hashchange", () => {
  const next = getHash();
  write(() => next);
});

function setHash(value: string | ((prev: string) => string)) {
  const next = typeof value === "function" ? value(hash()) : value;

  if (next !== window.location.hash) {
    // updates URL and triggers hashchange
    window.location.hash = next.startsWith("#") ? next : `#${next}`;
  }
}

export function useHash(): [ReadFn<string>, WriteFn<string>] {
  return [hash, setHash];
}
