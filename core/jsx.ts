// jsx.ts
import type { ReadFn } from "./signal";

export type JsxNode = VElement | VText | VSignal;

declare global {
  namespace JSX {
    type Element = any;

    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

export interface VElement {
  kind: "element";
  tag: string | ComponentFn;
  props: Record<string, any>;
  children: JsxNode[];
}

export interface VText {
  kind: "text";
  value: string;
}

export interface VSignal {
  kind: "signal";
  read: ReadFn<any>;
}

export interface PropsInterface {
  ctx?: any;
}

export type ComponentFn = (
  props: PropsInterface,
  children: JsxNode[]
) => JsxNode | null;

export function jsx(
  tag: string | ComponentFn,
  props: any,
  ...rawChildren: any[]
): VElement {
  return {
    kind: "element",
    tag,
    props: props ?? {},
    children: rawChildren.flatMap(normalizeChild),
  };
}

function normalizeChild(input: any): JsxNode | JsxNode[] {
  if (input == null || input === false || input === true) return [];

  if (typeof input === "function" && input?.type === "signal") {
    return {
      kind: "signal",
      read: input,
    };
  }

  if (typeof input === "string" || typeof input === "number") {
    return {
      kind: "text",
      value: String(input),
    };
  }

  if (Array.isArray(input)) {
    return input.flatMap(normalizeChild);
  }

  return input;
}
