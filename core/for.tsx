import { effect } from "./effect";
import { mount } from "./mount";
import { render } from "./render";
import { destroy } from "./destroy";
import type { ReadFn } from "./signal";

/**
 * For only renders arrays with objs that have a uuid
 */

type Uuid = string;
interface Keyed {
  uuid: Uuid;
}

interface ForProps<T extends Keyed> {
  each: ReadFn<T[]>;
}

export function For<T extends Keyed>(p: ForProps<T>, [child]: any) {
  // EIN Container
  const container = document.createElement("div");

  mount((parent) => {
    parent.appendChild(container);

    const nodes = new Map<Uuid, Element>();
    let order: Uuid[] = [];

    effect(p.each, async (values) => {
      const nextOrder: Uuid[] = [];

      // ADD + KEEP
      for (let i = 0; i < values.length; i++) {
        const v = values[i];
        if (!v || v.uuid == null) continue;

        const id = v.uuid;
        nextOrder.push(id);

        if (!nodes.has(id)) {
          const { el } = await render(child(v), {
            //@ts-expect-error
            ...p.ctx,
            parent: container,
          });

          if (!(el instanceof Element)) {
            throw new Error("For: Child-Root muss ein Element sein");
          }

          nodes.set(id, el);
        }
      }

      // REMOVE (and destroy)
      for (const id of order) {
        if (!nextOrder.includes(id)) {
          const el = nodes.get(id);
          if (el) {
            await destroy(el);
          }
          nodes.delete(id);
        }
      }

      // REORDER
      let anchor: ChildNode | null = null;
      for (let i = nextOrder.length - 1; i >= 0; i--) {
        const id = nextOrder[i];
        const el = nodes.get(id!)!;
        container.insertBefore(el, anchor);
        anchor = el;
      }

      order = nextOrder;
    });
  });

  return null;
}
