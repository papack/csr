// dom.ts
import type { ReadFn } from "./signal";
export type CSSValue = string | number;
export type MaybeSignal<T> = T | ReadFn<T>;
export interface DOMEvents {
  // Mouse
  onClick?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;

  // Pointer
  onPointerDown?: (e: PointerEvent) => void;
  onPointerUp?: (e: PointerEvent) => void;
  onPointerMove?: (e: PointerEvent) => void;
  onPointerEnter?: (e: PointerEvent) => void;
  onPointerLeave?: (e: PointerEvent) => void;
  onPointerOver?: (e: PointerEvent) => void;
  onPointerOut?: (e: PointerEvent) => void;

  // Keyboard
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;

  // Focus
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;

  // Input / Form
  onInput?: (e: InputEvent) => void;
  onChange?: (e: Event) => void;
  onSubmit?: (e: SubmitEvent) => void;

  // Drag
  onDragStart?: (e: DragEvent) => void;
  onDragEnd?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

export interface DOMAttrs {
  id?: string;
  class?: string;
  className?: string;
  title?: string;
  role?: string;
  tabIndex?: number;

  // allow data-* / aria-* / custom
  [key: string]: any;
}
