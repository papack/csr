// destroy.ts

import { runUnmountsForElement } from "./lifecycle";

export function destroy(root: Element): void {
  const children = Array.from(root.childNodes);

  for (const child of children) {
    destroyChild(child);
  }

  runUnmountsForElement(root);

  if (root.parentNode) {
    root.parentNode.removeChild(root);
  } else {
    root.remove();
  }
}

function destroyChild(node: Node): void {
  if (node instanceof Element) {
    const children = Array.from(node.childNodes);

    for (const child of children) {
      destroyChild(child);
    }

    runUnmountsForElement(node);

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      node.remove();
    }

    return;
  }

  // Text, Comment, etc.
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
