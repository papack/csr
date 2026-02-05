// render.ts
// Fully synchronous renderer.
// Signal subscriptions are ref-counted and cleaned up via lifecycle unmount.

import type { JsxNode, VElement, VText, VSignal, ComponentFn } from "./jsx";
import {
  beginMountSession,
  endMountSession,
  unmount,
  hasActiveMountSession,
} from "./lifecycle";
import { connector } from "./signal";

export interface RenderCtx {
  parent: Node & ParentNode;
  self?: Node;
  [k: string]: any;
}

export interface RenderResult {
  el: Node;
}

export function render(node: JsxNode | null, ctx: RenderCtx): RenderResult {
  if (node == null) {
    return { el: ctx.parent };
  }

  // FRAGMENT
  if (Array.isArray(node)) {
    let last: Node = ctx.parent;

    for (const child of node) {
      const r = render(child, ctx);
      last = r.el;
    }

    return { el: last };
  }

  // TEXT
  if (node.kind === "text") {
    const el = renderText(node as VText, ctx);
    return { el };
  }

  // SIGNAL (text binding)
  if (node.kind === "signal") {
    const el = renderSignal(node as VSignal, ctx);
    return { el };
  }

  // COMPONENT
  if (typeof (node as VElement).tag === "function") {
    const vnode = node as VElement;
    const fn = vnode.tag as ComponentFn;

    beginMountSession();

    const resolved = fn({ ...vnode.props, ctx }, vnode.children);
    const result = render(resolved, ctx);

    if (!(result.el instanceof Element)) {
      throw new Error("Component root must be a DOM Element");
    }

    endMountSession(result.el);
    ctx.self = result.el;
    return result;
  }

  // HOST
  const el = renderHost(node as VElement, ctx);

  const childCtx: RenderCtx = {
    ...ctx,
    parent: el,
    self: ctx.self,
  };

  for (const child of (node as VElement).children) {
    render(child, childCtx);
  }

  return { el };
}

/* ------------------------------------------------------------
 * Host rendering
 * ------------------------------------------------------------ */

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

function renderHost(node: VElement, ctx: RenderCtx): Element {
  if (typeof node.tag !== "string") {
    throw new Error("Host renderer expects string tag");
  }

  const tag = node.tag;
  const isSvg = SVG_TAGS.has(tag);

  const el = isSvg
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  const props = node.props ?? {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "ctx" || key === "children") continue;

    // EVENTS
    if (key.startsWith("on") && typeof value === "function") {
      const evt = key.slice(2).toLowerCase();
      el.addEventListener(evt, value as EventListener);
      continue;
    }

    // STYLE (supports signals)
    if (key === "style" && value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, any>)) {
        if (v === undefined) continue;

        if (typeof v === "function" && v.type === "signal") {
          const initial = v();
          (el.style as any)[k] = String(initial);

          v((nv: any) => {
            (el.style as any)[k] = String(nv);
          });
        } else {
          (el.style as any)[k] = String(v);
        }
      }
      continue;
    }

    // SIGNAL PROPS
    if (typeof value === "function" && value.type === "signal") {
      const apply = (nv: any) => {
        if (isSvg) {
          el.setAttribute(key, String(nv));
        } else {
          // @ts-ignore
          el[key] = nv;
        }
      };

      apply(value());
      bindSignal(value, apply);
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

/* ------------------------------------------------------------
 * Text & Signal rendering
 * ------------------------------------------------------------ */

function renderText(node: VText, ctx: RenderCtx): Text {
  const t = document.createTextNode(node.value);
  ctx.parent.appendChild(t);
  return t;
}

function renderSignal(node: VSignal, ctx: RenderCtx): Text {
  const t = document.createTextNode("");
  ctx.parent.appendChild(t);

  const cb = (v: any) => {
    t.nodeValue = String(v);
  };

  // initial
  t.nodeValue = String(node.read());

  // subscribe
  node.read(cb);

  // cleanup via lifecycle (ref-count aware)
  if (hasActiveMountSession()) {
    unmount(() => {
      const uuid = connector.getUuidByClbk(cb);
      connector.removeClbk(uuid, cb);
    });
  }

  return t;
}

/* ------------------------------------------------------------
 * Shared signal binding helper
 * ------------------------------------------------------------ */

function bindSignal<T>(
  read: (cb?: (value: T) => void) => T,
  apply: (value: T) => void,
): void {
  const cb = (v: any) => apply(v as T);

  read(cb);

  if (hasActiveMountSession()) {
    unmount(() => {
      const uuid = connector.getUuidByClbk(cb);
      connector.removeClbk(uuid, cb);
    });
  }
}
