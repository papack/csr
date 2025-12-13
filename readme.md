# @papack/csr

Async UI Dom runtime (experimental) .Designed for **predictability over comfort** — which, in practice, _creates_ comfort.
No Virtual DOM. No content diffing.
Instead: **real mutation**, **async components**, **deterministic structural updates**.

Zero dependencies. Fully TypeScript.

## Features

- Async components (`await` directly inside components)
- Deterministic rendering without a Virtual DOM
- `signal` / `effect` as minimal reactivity primitives
- Explicit lifecycle (`mount`, `unmount`, `destroy`)
- Keyed `For` with stable DOM identity
- Structural conditional rendering (`Show`)
- Mutation is allowed (by design)
- Fully TypeScript

## Core Ideas

- **Async components are first-class**

  ```ts
  async function User() {
    const data = await fetch("/api/user").then((r) => r.json());
    return <div>{data.name}</div>;
  }
  ```

- **Signals are active sources**

  - no reference equality checks
  - mutation is allowed
  - every `set()` reliably triggers effects

- **Lifecycle is bound to real DOM nodes**

  - `mount` / `unmount` attach to actual elements
  - for: reordering ≠ remounting
  - removal = real `destroy`

## Example

```ts
import { jsx, render, signal } from "../core";
import { For } from "../core/for";

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

---

## `signal`

Signals are **active state containers**, not passive values.

```ts
const [count, setCount] = signal(0);

setCount((v) => v + 1);
setCount(() => 42);
```

### Properties

- `set()` **always triggers**
- no equality checks
- mutation is allowed
- async setters are allowed

## `effect(readFn, callback)`

Subscribes to a signal and reacts to changes.

```ts
effect(count, (value) => {
  console.log(value);
});
```

### Characteristics

- runs immediately with the current value
- runs on **every** `set()`
- no dependency tracking
- async callbacks supported

```ts
effect(userId, async (id) => {
  const user = await fetch(`/api/user/${id}`).then((r) => r.json());
});
```

````md
## Context Injection

`render()` accepts arbitrary values on the top-level context.  
This context is automatically available in **every component** via `props.ctx`.

```ts
render(<App />, {
  parent: document.body,
  api,
  events,
  dummy: 42,
});
```
````

```ts
function Item(p: any) {
  console.log(p.ctx.dummy); // 42
  p.ctx.api.fetch();
}
```

- no providers
- no hooks
- no imports
- no reactivity

Context is for **stable infrastructure** (stores, APIs, event buses),
not for frequently changing UI state.

The context is immutable for the lifetime of the render tree and
does not trigger re-renders.

## Lifecycle Primitives

Lifecycle is **explicit** and **structural**.

### `mount(fn)`

Registers a callback that runs **once**, when the component’s root DOM element
is attached.

```ts
mount((parent) => {
  // parent === root Element
});
```

- runs exactly once per component instance
- runs after the DOM node exists
- used for subscriptions, timers, imperative DOM work

### `unmount(fn)`

Registers cleanup logic tied to the component’s root element.

```ts
unmount(() => {
  // cleanup
});
```

- runs exactly once
- runs before DOM removal
- children unmount before parents
- guaranteed execution

## `For` (intentionally restricted)

`For` is **not** a general iterator.
It is a **keyed structural renderer**.

### Rules

- `each` **must** bet an array
- each item **must** be an object
- each object **must** have a stable key field (e.g. `uuid`)
- no fallbacks, no warnings

```ts
type Item = {
  uuid: string; // required
  [key: string]: any;
};
```

### What `For` does

- detects:

  - order changes
  - added items
  - removed items

- performs:

  - DOM moves (`insertBefore`)
  - rendering **only** for new keys
  - `destroy()` for removed keys

### What `For` does **not** do

- no content diffing
- no re-rendering existing items
- no prop patching
- no heuristic matching

> If an item’s content changes, the item itself must be reactive.

---

## Mutation: allowed

```ts
setItems((prev) => {
  prev.push({ uuid: "c", name: "C" });
  return prev;
});
```

This is **correct**.

Why:

- `signal` is active
- effects are not reference-based
- `For` evaluates only keys and order

## `Show` (structural conditional rendering)

`Show` controls **existence**, not visibility.

```ts
<Show when={visible}>
  <User />
</Show>
```

### Behavior

- creates a stable host once
- renders the subtree when signal is `true`
- fully destroys it when signal is `false`
