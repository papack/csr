// for.ts
import { effect } from "./effect";
import { mount } from "./lifecycle";
import { render } from "./render";
import { destroy } from "./destroy";
import type { ReadFn } from "./signal";
import { jsx } from "./jsx";

type Uuid = string;

interface Keyed {
  uuid: Uuid;
}

interface ForProps<T extends Keyed> {
  each: ReadFn<T[]>;
}

export function For<T extends Keyed>(p: ForProps<T>, [child]: any) {
  const container = jsx("csr-for-host", { style: { display: "contents" } });

  mount((parent) => {
    const { el } = render(container, { parent });
    const host = el as Element;

    const nodes = new Map<Uuid, Element>();
    let order: Uuid[] = [];

    function reconcile(values: T[]) {
      const nextOrder: Uuid[] = [];

      for (const v of values) {
        if (!v || v.uuid == null) continue;

        const id = v.uuid;
        nextOrder.push(id);

        if (!nodes.has(id)) {
          const { el } = render(child(v), {
            ...(p as any).ctx,
            parent: host,
          });

          if (!(el instanceof Element)) {
            throw new Error("For: child root must be an Element");
          }

          nodes.set(id, el);
        }
      }

      // remove
      for (const id of order) {
        if (!nextOrder.includes(id)) {
          const el = nodes.get(id);
          if (el) destroy(el);
          nodes.delete(id);
        }
      }

      // reorder
      let anchor: ChildNode | null = null;
      for (let i = nextOrder.length - 1; i >= 0; i--) {
        const el = nodes.get(nextOrder[i]!)!;
        host.insertBefore(el, anchor);
        anchor = el;
      }

      order = nextOrder;
    }

    // initial render (sync, explicit)
    reconcile(p.each());

    // reactive updates
    effect(p.each, reconcile);
  });

  return null;
}
