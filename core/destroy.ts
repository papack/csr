// destroy.ts
import { runUnmountsForElement } from "./lifecycle";

export function destroy(root: Element): void {
  const children = Array.from(root.childNodes);

  for (const child of children) {
    destroyChild(child);
  }

  runUnmountsForElement(root);

  try {
    root.parentNode?.removeChild(root);
  } catch (err) {
    console.warn("failed to remove root node", err, root);
  }
}

function destroyChild(node: Node): void {
  if (node instanceof Element) {
    const children = Array.from(node.childNodes);

    for (const child of children) {
      destroyChild(child);
    }

    runUnmountsForElement(node);

    try {
      node.parentNode?.removeChild(node);
    } catch (err) {
      console.warn("failed to remove element node", err, node);
    }

    return;
  }

  // Text, Comment, etc.
  try {
    node.parentNode?.removeChild(node);
  } catch (err) {
    console.warn("failed to remove node", err, node);
  }
}
