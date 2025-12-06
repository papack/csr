// jsx.ts

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
    type Element = any;
  }
}

export type JsxChild = JsxNode | JsxText | JsxSignal;

export interface JsxText {
  kind: "text";
  value: string;
}

export interface JsxSignal {
  kind: "signal";
  value: any;
}

export interface JsxNode {
  kind: "host" | "component" | "signal" | "effect";
  tag: string | ComponentFn;
  props: any;
  children: JsxChild[];
}

export type ComponentFn = (
  props: any,
  children: JsxChild[]
) => Promise<JsxNode>;

// 1) JSX sammelt nur Struktur
export function jsx(
  tag: string | ComponentFn,
  props: any,
  ...rawChildren: any[]
): JsxNode {
  const children = rawChildren.flatMap(normalizeChild);

  return {
    kind: typeof tag === "string" ? "host" : "component",
    tag,
    props,
    children,
  };
}

function normalizeChild(input: any): JsxChild | JsxChild[] {
  if (input == null || input === false || input === true) return [];

  if (typeof input === "function" && input?.type === "signal") {
    return { kind: "signal", value: input };
  }

  if (typeof input === "string" || typeof input === "number") {
    return { kind: "text", value: String(input) };
  }

  if (Array.isArray(input)) {
    return input.flatMap(normalizeChild);
  }

  // muss ein JsxNode sein
  return input;
}
