import type { ComponentFn, JsxNode, JsxChild, JsxText, JsxSignal } from "./jsx";
import { beginComponentMountSession, endComponentMountSession } from "./mount";

export interface RenderCtx {
  parent: Node & ParentNode;
  [k: string]: any;
}

export interface RenderResult {
  el: Node;
}

export async function render(
  node: JsxChild | Promise<JsxChild> | null | Promise<null>,
  ctx: RenderCtx
): Promise<RenderResult> {
  node = await node;

  //nothing
  if (node == null) {
    return { el: ctx.parent };
  }

  //fragement recursive
  if (Array.isArray(node)) {
    for (const item of node) {
      return await render(item, ctx);
    }
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

// HOST Renderer
const SVG_NS = "http://www.w3.org/2000/svg";

const SVG_TAGS = new Set([
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "mask",
  "clipPath",
  "pattern",
  "text",
  "tspan",
  "use",
  "symbol",
  "view",
  "ellipse",
  "foreignObject",
]);

async function renderHost(node: JsxNode, ctx: RenderCtx): Promise<Element> {
  if (typeof node.tag !== "string") {
    throw new Error("Host renderer erwartet string-Tag.");
  }

  const tag = node.tag;
  const isSvg = SVG_TAGS.has(tag);

  const el = isSvg
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  const props = node.props || {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "ctx" || key === "children") continue;

    // EVENTS
    if (key.startsWith("on") && typeof value === "function") {
      const evt = key.slice(2).toLowerCase();
      el.addEventListener(evt, value as EventListener);
      continue;
    }

    // STYLE (allow Signals)
    if (key === "style" && value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, any>)) {
        if (typeof v === "function" && v.type === "signal") {
          const initial = await v();
          el.style.setProperty(k, String(initial));

          await v(async (nv: any) => {
            el.style.setProperty(k, String(nv));
          });
        } else {
          el.style.setProperty(k, String(v));
        }
      }
      continue;
    }

    // SIGNAL PROPS (HTML + SVG)
    //@ts-ignore
    if (typeof value === "function" && value.type === "signal") {
      const initial = await value();

      if (isSvg) {
        el.setAttribute(key, String(initial));

        await value(async (nv: any) => {
          el.setAttribute(key, String(nv));
        });
      } else {
        // @ts-ignore
        el[key] = initial;

        await value(async (nv: any) => {
          // @ts-ignore
          el[key] = nv;
        });
      }
      continue;
    }

    // NORMAL PROPS
    if (isSvg) {
      el.setAttribute(key, String(value));
    } else if (key in el) {
      // @ts-ignore
      el[key] = value;
    } else {
      el.setAttribute(key, String(value));
    }
  }

  ctx.parent.appendChild(el);
  return el;
}

// TEXT Renderer
function renderText(node: JsxText, ctx: RenderCtx): Text {
  const t = document.createTextNode(node.value);
  ctx.parent.appendChild(t);
  return t;
}

// SIGNAL Renderer
async function renderSignal(node: JsxSignal, ctx: RenderCtx): Promise<Text> {
  const el = document.createTextNode("");
  ctx.parent.appendChild(el);

  await node.value(async (value: any) => {
    if (el instanceof Text) {
      el.nodeValue = String(value);
    } else {
      throw "svg not implemented with number and string";
    }
  });

  return el;
}
