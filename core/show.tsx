//show
import { jsx } from "./jsx";
import { destroy } from "./destroy";
import { render } from "./render";
import type { ReadFn } from "./signal";
import { effect } from "./effect";
import {
  mount,
  beginComponentMountSession,
  endComponentMountSession,
} from "./mount";

interface ShowPropsInterface {
  when: ReadFn<boolean>;
}
export async function Show(p: ShowPropsInterface, children: any) {
  const host = jsx("csr-show-host", { style: { display: "contents" } });
  const content = jsx(
    "csr-show-content",
    { style: { display: "contents" } },
    ...children
  );

  let hostEl: Element | null = null;
  let contentEl: Element | null = null;
  let visible = false;

  mount(async (parent) => {
    const { el: h } = await render(host, { parent });
    hostEl = h as Element;

    effect(p.when, async (b) => {
      if (b === visible) return;
      visible = b;

      if (!visible) {
        if (contentEl) {
          await destroy(contentEl);
          contentEl = null;
        }
        return;
      }

      beginComponentMountSession();

      const { el: c } = await render(content, {
        //@ts-expect-error
        ...p.ctx,
        parent: hostEl!,
      });

      if (!(c instanceof Element)) {
        throw new Error("Show: Content root must be an Element");
      }

      endComponentMountSession(c);
      contentEl = c;
    });
  });

  return null;
}
