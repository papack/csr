import { runUnmountsForElement } from "./mount";

export async function destroy(root: Element): Promise<void> {
  const children = Array.from(root.childNodes);

  for (const child of children) {
    await destroyChild(child);
  }

  await runUnmountsForElement(root);

  if (root.parentNode) {
    root.parentNode.removeChild(root);
  } else {
    root.remove(); // Element hat remove()
  }
}

async function destroyChild(node: Node): Promise<void> {
  if (node instanceof Element) {
    const kids = Array.from(node.childNodes);

    for (const k of kids) {
      await destroyChild(k);
    }

    await runUnmountsForElement(node);

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      node.remove();
    }

    return;
  }

  // Text/Comment etc.
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
