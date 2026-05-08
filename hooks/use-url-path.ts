// use-url-path.ts
import { signal, type ReadFn } from "../core/signal";

type WriteFn<T> = (value: T | ((prev: T) => T)) => void;

function getPath(): string {
  return window.location.pathname || "/";
}

const [path, write] = signal<string>(getPath());

window.addEventListener("popstate", () => {
  write(() => getPath());
});

function setPath(value: string | ((prev: string) => string)) {
  const current = window.location;

  const next = typeof value === "function" ? value(path()) : value;

  const pathname = next.startsWith("/") ? next : `/${next}`;

  if (pathname !== current.pathname) {
    const url = pathname + current.search + current.hash;

    window.history.pushState(null, "", url);

    write(() => getPath());
  }
}

export function useUrlPath(): [ReadFn<string>, WriteFn<string>] {
  return [path, setPath];
}
