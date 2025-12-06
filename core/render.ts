import type { ComponentFn, JsxNode, JsxChild, JsxText, JsxSignal } from "./jsx";
import { beginComponentMountSession, endComponentMountSession } from "./mount";

export interface RenderCtx {
  parent: Node & ParentNode;
  self?: Node;
  [k: string]: any;
}

export interface RenderResult {
  el: Node;
}

export async function render(
  node: JsxChild,
  ctx: RenderCtx
): Promise<RenderResult> {
  if (node == null) {
    return { el: ctx.parent };
  }

  // TEXT NODE
  if (node.kind === "text") {
    const el = renderText(node as JsxText, ctx);
    return { el };
  }

  //SIGNAL
  if (node.kind === "signal") {
    const el = await renderSignal(node as JsxSignal, ctx);
    return { el };
  }

  // COMPONENT NODE
  if (node.kind === "component") {
    const fn = node.tag as ComponentFn;

    // Mount/Unmount-Session für diese Component
    beginComponentMountSession();

    // Component-Funktion ausführen
    const resolved = await fn({ ...node.props, ctx }, node.children);

    // gerenderten Output rendern
    const result = await render(resolved, ctx);

    // Mounts ausführen und Unmounts am Root-Element registrieren
    if (result.el instanceof Element) {
      endComponentMountSession(result.el);
    } else {
      console.warn(
        "Component-Root ist kein Element. Mount/Unmount werden ignoriert."
      );
    }

    ctx.self = result.el;
    return result;
  }

  // HOST NODE
  const el = await renderHost(node as JsxNode, ctx);

  const childCtx: RenderCtx = {
    ...ctx,
    parent: el,
    self: ctx.self,
  };

  for (const child of (node as JsxNode).children) {
    await render(child, childCtx);
  }

  return { el };
}

// ---------------------------------------------------------
// HOST Renderer
// ---------------------------------------------------------

function renderHost(node: JsxNode, ctx: RenderCtx): HTMLElement {
  if (typeof node.tag !== "string") {
    throw new Error("Host renderer erwartet string-Tag.");
  }

  const el = document.createElement(node.tag);
  const props = node.props || {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "ctx" || key === "children") continue;

    //fn
    if (key.startsWith("on") && typeof value === "function") {
      const evt = key.slice(2).toLowerCase();
      el.addEventListener(evt, value as EventListener);
      continue;
    }

    //style
    if (key === "style" && value !== null && typeof value === "object") {
      for (const [k, v] of Object.entries(
        value as Record<string, string | any>
      )) {
        if (typeof v === "function") {
          v((newValue: any) => {
            console.log(newValue);
            el.style.setProperty(k, newValue);
          });
          continue;
        }
        el.style.setProperty(k, v);
      }
      continue;
    }

    if (key in el) {
      // @ts-ignore
      el[key] = value;
    } else {
      el.setAttribute(key, String(value));
    }
  }

  ctx.parent.appendChild(el);
  return el;
}

// ---------------------------------------------------------
// TEXT Renderer
// ---------------------------------------------------------

function renderText(node: JsxText, ctx: RenderCtx): Text {
  const t = document.createTextNode(node.value);
  ctx.parent.appendChild(t);
  return t;
}

// ---------------------------------------------------------
// SIGNAL Renderer
// ---------------------------------------------------------

async function renderSignal(node: JsxSignal, ctx: RenderCtx): Promise<Text> {
  const t = document.createTextNode("");
  ctx.parent.appendChild(t);

  await node.value(async (v: any) => {
    changeText(t, String(v));
  });

  return t;
}

function changeText(el: Text, value: string | number) {
  if (el instanceof Text) {
    el.nodeValue = String(value);
  } else {
    throw "svg not implemented with number and string";
  }
}
