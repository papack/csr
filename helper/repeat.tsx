// repeat.ts
import type { ReadFn } from "../core/signal";
import { signal } from "../core/signal";
import { For } from "../core/for";
import { jsx } from "../core/jsx";

type MaybeSignal<T> = T | ReadFn<T>;

interface RepeatPropsInterface {
  n: MaybeSignal<number>;
}

export function Repeat(p: RepeatPropsInterface, children: any[]) {
  // static case
  if (typeof p.n === "number") {
    const out: any[] = [];
    for (let i = 0; i < p.n; i++) {
      out.push(children);
    }
    return out;
  }

  // reactive case -> delegate to For
  const count = p.n;

  const [items, setItems] = signal<{ uuid: string }[]>([]);

  // derive structure from n
  count((n) => {
    const next: { uuid: string }[] = [];
    for (let i = 0; i < n; i++) {
      next.push({ uuid: String(i) });
    }
    setItems(() => next);
  });

  return <For each={items}>{() => children}</For>;
}
