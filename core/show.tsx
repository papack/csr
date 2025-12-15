import { jsx } from "./jsx";
import { destroy } from "./destroy";
import { render } from "./render";
import { mount } from "./mount";
import type { ReadFn } from "./signal";
import { effect } from "./effect";

interface ShowPropsInterface {
  when: ReadFn<boolean>;
}
export async function Show(p: ShowPropsInterface, children: any) {
  // Stabiler Host-Knoten (NICHT neu erzeugen)
  const host = jsx("csr-show-host", { style: { display: "contents" } });

  // Stabiles Content-VNode (NICHT neu erzeugen)
  const content = jsx(
    "csr-show-content",
    { style: { display: "contents" } },
    ...children
  );

  let hostEl: Element | null = null;
  let contentEl: Element | null = null;

  mount(async (parent) => {
    // Render ONE Host
    const { el: h } = await render(host, { parent });
    hostEl = h as Element;

    //init visible must be true.
    //let effect decide
    let visible = false;
    effect(p.when, async (b) => {
      visible = !visible;

      if (!visible) {
        // on "hide". Destroy the whole tree
        if (contentEl) {
          await destroy(contentEl);
          contentEl = null;
        }
      } else {
        // render the whole tree
        const { el: c } = await render(content, {
          //@ts-expect-error
          ...p.ctx,
          parent: hostEl!,
        });
        contentEl = c as Element;
      }
    });
  });

  // Show produce his own structure, an MUST return nothing
  return null;
}
