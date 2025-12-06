import { jsx } from "./jsx";
import { destroy } from "./destroy";
import { render } from "./render";
import { mount } from "./mount";
import { unmount } from "./unmount";
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

  mount(async (self) => {
    // Render Host EINMAL
    const { el: h } = await render(host, { parent: self });
    hostEl = h as Element;

    //muss false sein.. weil show macht nen subtree!!!
    let visible = false;
    effect(p.when, async (b) => {
      visible = !visible;

      if (!visible) {
        // Beim Verstecken → kompletten Content zerstören
        if (contentEl) {
          await destroy(contentEl);
          contentEl = null;
        }
      } else {
        // Content erneut rendern
        const { el: c } = await render(content, { parent: hostEl! });
        contentEl = c as Element;
      }
    });
  });

  // Show produziert seine eigene DOM-Struktur, nix rendern
  return null;
}
