import type { RenderCtx } from "./render";
import type { ReadFn } from "./signal";

type EventHandler<E extends Event = Event> = (event: E) => void;

interface DOMEvents {
  onClick?: EventHandler<MouseEvent>;
  onDblClick?: EventHandler<MouseEvent>;
  onMouseDown?: EventHandler<MouseEvent>;
  onMouseUp?: EventHandler<MouseEvent>;
  onMouseMove?: EventHandler<MouseEvent>;
  onMouseEnter?: EventHandler<MouseEvent>;
  onMouseLeave?: EventHandler<MouseEvent>;

  onKeyDown?: EventHandler<KeyboardEvent>;
  onKeyUp?: EventHandler<KeyboardEvent>;
  onInput?: EventHandler<InputEvent>;
  onChange?: EventHandler<Event>;

  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
}

interface StyleProps {
  [key: string]: string | number | ReadFn<string | number>;
}

type MaybeSignal<T> = T | ReadFn<T>;

interface HTMLAttributes extends DOMEvents {
  id?: string;
  class?: string;
  className?: string;
  title?: string;

  style?: StyleProps;

  value?: MaybeSignal<string | number>;
  checked?: MaybeSignal<boolean>;
  disabled?: MaybeSignal<boolean>;

  children?: any;
}

interface SVGAttributes extends DOMEvents {
  id?: string;
  class?: string;

  style?: StyleProps;

  viewBox?: MaybeSignal<string>;
  fill?: MaybeSignal<string>;
  stroke?: MaybeSignal<string>;
  strokeWidth?: MaybeSignal<number>;

  d?: MaybeSignal<string>;
  cx?: MaybeSignal<string | number>;
  cy?: MaybeSignal<string | number>;
  r?: MaybeSignal<string | number>;

  x?: MaybeSignal<string | number>;
  y?: MaybeSignal<string | number>;
  width?: MaybeSignal<string | number>;
  height?: MaybeSignal<string | number>;

  children?: any;
}

declare global {
  namespace JSX {
    type Element = JsxNode;

    interface IntrinsicElements {
      // HTML
      div: HTMLAttributes;
      li: HTMLAttributes;
      ul: HTMLAttributes;
      h1: HTMLAttributes;
      h2: HTMLAttributes;
      h3: HTMLAttributes;
      h4: HTMLAttributes;
      h5: HTMLAttributes;
      h6: HTMLAttributes;
      span: HTMLAttributes;
      p: HTMLAttributes;
      button: HTMLAttributes;
      input: HTMLAttributes & {
        type?: string;
        placeholder?: string;
      };
      textarea: HTMLAttributes;
      form: HTMLAttributes;
      label: HTMLAttributes;

      // SVG
      svg: SVGAttributes;
      path: SVGAttributes;
      circle: SVGAttributes;
      rect: SVGAttributes;
      g: SVGAttributes;
      line: SVGAttributes;
      polyline: SVGAttributes;
      polygon: SVGAttributes;
      text: SVGAttributes;
      tspan: SVGAttributes;
    }
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
  kind: "host" | "component" | "signal";
  tag: string | ComponentFn;
  props: any;
  children: JsxChild[];
}

export interface PropsInterface {
  ctx?: RenderCtx;
}

export type ComponentFn = (
  props: PropsInterface,
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

  return input;
}
