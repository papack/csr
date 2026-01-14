// show.ts
import { jsx } from "./jsx";
import { destroy } from "./destroy";
import { render } from "./render";
import type { ReadFn } from "./signal";
import { mount } from "./lifecycle";

interface ShowPropsInterface {
  when: ReadFn<boolean>;
}

export function Show(p: ShowPropsInterface, children: any) {
  const host = jsx("csr-show-host", { style: { display: "contents" } });
  const content = jsx(
    "csr-show-content",
    { style: { display: "contents" } },
    ...children
  );

  let hostEl: Element | null = null;
  let contentEl: Element | null = null;
  let visible = false;

  mount((parent) => {
    // render host once
    const { el: h } = render(host, { parent });
    hostEl = h as Element;

    // subscribe to condition signal
    p.when((b) => {
      if (b === visible) return;
      visible = b;

      // hide
      if (!visible) {
        if (contentEl) {
          destroy(contentEl);
          contentEl = null;
        }
        return;
      }

      // show
      const { el: c } = render(content, {
        ...(p as any).ctx,
        parent: hostEl!,
      });

      if (!(c instanceof Element)) {
        throw new Error("Show: content root must be an Element");
      }

      contentEl = c;
    });
  });

  return null;
}
