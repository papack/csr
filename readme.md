# @papack/csr

**Experimental synchronous UI DOM runtime.**
Designed for **simplicity, explicitness, and predictability**.

> **No feature is the feature.**

No Virtual DOM.
No diffing.
No scheduler.
No hidden async.

Just **real DOM**, **real mutation**, and **deterministic structure** with zero dependencies.

---

## Philosophy

This library is **simple by design**, not “easy”.

- There is **one way** to do things
- Everything is **explicit**

It _is_ optimized for **clarity and long-term maintenance**.

---

## Features

- Fully **synchronous rendering**
- No Virtual DOM, no reconciliation
- Minimal reactivity via `signal` / `effect`
- Explicit lifecycle (`mount`, `unmount`)
- Structural primitives (`Show`, `For`)

---

## Core Ideas

### Signals are active state

Signals are **sources**, not values.

```ts
const [count, setCount] = signal(0);

setCount((v) => v + 1);
setCount(() => 42);
```

- no equality checks
- no dependency tracking
- mutation is allowed
- every write notifies every subscriber

### Effects are explicit reactions to signals

```ts
effect(count, (value) => {
  console.log(value);
});
```

Characteristics:

- runs immediately with the current value
- runs on **every** write
- only one singal, no dependency arrays
- async callbacks are allowed (fire-and-forget)

> Effects are **not awaited**.
> Concurrency is explicit and intentional.

### Lifecycle is bound to real DOM

Lifecycle is structural, not conceptual.

```ts
mount((parent) => {
  // runs once, when the root DOM element exists
});

unmount(() => {
  // guaranteed cleanup before removal
});
```

- lifecycle is attached to **actual DOM nodes**
- children unmount before parents
- removal means real `destroy`

---

## Example

```ts
import { render, signal } from "@papack/csr";
import { For } from "@papack/csr/for";

const [items, setItems] = signal([
  { uuid: "a", name: "A" },
  { uuid: "b", name: "B" },
]);

render(<App />, { parent: document.body });

function App() {
  return (
    <ul>
      <For each={items}>{(item) => <li>{item.name}</li>}</For>
    </ul>
  );
}
```

## Structural Rendering

### `Show`

Controls **existence**, not visibility.

```ts
<Show when={visible}>
  <User />
</Show>
```

- when `false`, the subtree is destroyed
- when `true`, it is rendered fresh
- lifecycle runs correctly on both transitions

### `For` (intentionally restricted)

`For` is a **keyed structural renderer**, not a generic iterator.

Rules:

- `each` must be an array
- each item must be an object
- each item must have a stable key (`uuid`)
- no fallbacks, no heuristics

```ts
type Item = {
  uuid: string;
  [key: string]: any;
};
```

What `For` does:

- detects:

  - additions
  - removals
  - order changes

- performs:

  - DOM moves (`insertBefore`)
  - rendering only for new keys
  - `destroy()` for removed keys

What `For` does **not** do:

- no content diffing
- no re-rendering existing items
- no prop patching

> If an item’s content changes, the item itself must be reactive.

---

## Mutation is allowed

```ts
setItems((prev) => {
  prev.push({ uuid: "c", name: "C" });
  return prev;
});
```

This is **correct**.

Why:

- signals are active
- updates are not reference-based
- `For` only cares about keys and order

## Routing

Routing is **just application state**.

```ts
const [route, setRoute] = signal("home");
```

Structure is derived explicitly:

```ts
effect(route, (r) => {
  setIsHome(() => r === "home");
  setIsSettings(() => r === "settings");
});
```

```tsx
<Show when={isHome}>
  <Home />
</Show>

<Show when={isSettings}>
  <Settings />
</Show>
```
