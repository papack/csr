import { jsx, mount, render, unmount } from "../core";
import { destroy } from "../core/destroy";

export function Portal(_: any, children: any) {
  const host = document.createElement("csr-portal");
  mount(() => {
    document.body.appendChild(host);

    for (const child of children) {
      render(child, {
        parent: host,
      });
    }
  });

  unmount(() => {
    destroy(host);
  });
}
