import { jsx } from "./jsx";
import { destroy } from "./destroy";
import { render } from "./render";
import { mount } from "./mount";
import { unmount } from "./unmount";

export async function Show(p: any, children: any) {
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
  let intervalId: any = null;

  mount(async (self) => {
    // Render Host EINMAL
    const { el: h } = await render(host, { parent: self });
    hostEl = h as Element;

    //muss false sein.. weil show macht nen subtree!!!
    let visible = false;

    intervalId = setInterval(async () => {
      visible = !visible;

      if (!visible) {
        // Beim Verstecken → kompletten Content zerstören
        if (contentEl) {
          await destroy(contentEl);
          contentEl = null;
        }
      } else {
        // Vor erneutem Anzeigen Host leeren, falls noch Reste drinstehen
        while (hostEl!.firstChild) {
          const child = hostEl!.firstChild;
          if (child instanceof Element) {
            await destroy(child);
          } else {
            hostEl!.removeChild(child);
          }
        }

        // Content erneut rendern
        const { el: c } = await render(content, { parent: hostEl! });
        contentEl = c as Element;
      }
    }, p.time ?? 5000);
  });

  unmount(() => {
    if (intervalId !== null) clearInterval(intervalId);
  });

  // Show produziert seine eigene DOM-Struktur, nix rendern
  return null;
}
