// box.ts
import type { ReadFn } from "../core/signal";
import { jsx } from "../core/jsx";
import type { DOMEvents, DOMAttrs, MaybeSignal, CSSValue } from "../core/dom";

export interface BoxProps extends DOMEvents, DOMAttrs {
  /**
   * Child nodes rendered inside the box
   */
  children?: any;

  // ─────────────────────────────
  // Spacing – Margin
  // ─────────────────────────────

  /** Margin (all sides) */
  m?: MaybeSignal<CSSValue>;

  /** Margin-bottom */
  mb?: MaybeSignal<CSSValue>;

  /** Margin-left */
  ml?: MaybeSignal<CSSValue>;

  /** Margin-right */
  mr?: MaybeSignal<CSSValue>;

  /** Margin-top */
  mt?: MaybeSignal<CSSValue>;

  /** Margin horizontal (left + right) */
  mx?: MaybeSignal<CSSValue>;

  /** Margin vertical (top + bottom) */
  my?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Spacing – Padding
  // ─────────────────────────────

  /** Padding (all sides) */
  p?: MaybeSignal<CSSValue>;

  /** Padding-bottom */
  pb?: MaybeSignal<CSSValue>;

  /** Padding-left */
  pl?: MaybeSignal<CSSValue>;

  /** Padding-right */
  pr?: MaybeSignal<CSSValue>;

  /** Padding-top */
  pt?: MaybeSignal<CSSValue>;

  /** Padding horizontal (left + right) */
  px?: MaybeSignal<CSSValue>;

  /** Padding vertical (top + bottom) */
  py?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Borders
  // ─────────────────────────────

  /** Border (all sides) */
  b?: MaybeSignal<CSSValue>;

  /** Border-top */
  bt?: MaybeSignal<CSSValue>;

  /** Border-right */
  br?: MaybeSignal<CSSValue>;

  /** Border-bottom */
  bb?: MaybeSignal<CSSValue>;

  /** Border-left */
  bl?: MaybeSignal<CSSValue>;

  /** Border horizontal (left + right) */
  bx?: MaybeSignal<CSSValue>;

  /** Border vertical (top + bottom) */
  by?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Border Radius
  // ─────────────────────────────

  /** Border radius (all corners) */
  r?: MaybeSignal<CSSValue>;

  /** Border-top radius */
  rt?: MaybeSignal<CSSValue>;

  /** Border-right radius */
  rr?: MaybeSignal<CSSValue>;

  /** Border-bottom radius */
  rb?: MaybeSignal<CSSValue>;

  /** Border-left radius */
  rl?: MaybeSignal<CSSValue>;

  /** Border-top-right radius */
  rtr?: MaybeSignal<CSSValue>;

  /** Border-top-left radius */
  rtl?: MaybeSignal<CSSValue>;

  /** Border-bottom-right radius */
  rbr?: MaybeSignal<CSSValue>;

  /** Border-bottom-left radius */
  rbl?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Sizing
  // ─────────────────────────────

  /** Size shortcut (width + height) */
  s?: MaybeSignal<CSSValue>;

  /** Height */
  h?: MaybeSignal<CSSValue>;

  /** Width */
  w?: MaybeSignal<CSSValue>;

  /** Max height */
  maxH?: MaybeSignal<CSSValue>;

  /** Max width */
  maxW?: MaybeSignal<CSSValue>;

  /** Min height */
  minH?: MaybeSignal<CSSValue>;

  /** Min width */
  minW?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Appearance
  // ─────────────────────────────

  /** Opacity (0–1) */
  o?: MaybeSignal<CSSValue>;

  /** Box shadow */
  sh?: MaybeSignal<CSSValue>;

  /** Background */
  bg?: MaybeSignal<CSSValue>;

  /**
   * Additional inline styles (merged last)
   * Values support signals
   */
  style?: Record<string, MaybeSignal<CSSValue> | undefined>;
}

export function Box(p: BoxProps, children: any[]) {
  return (
    <div
      {...p}
      style={{
        marginBottom: p.mb ?? p.my ?? p.m,
        marginLeft: p.ml ?? p.mx ?? p.m,
        marginRight: p.mr ?? p.mx ?? p.m,
        marginTop: p.mt ?? p.my ?? p.m,

        paddingBottom: p.pb ?? p.py ?? p.p,
        paddingLeft: p.pl ?? p.px ?? p.p,
        paddingRight: p.pr ?? p.px ?? p.p,
        paddingTop: p.pt ?? p.py ?? p.p,

        background: p.bg,
        opacity: p.o,
        boxShadow: p.sh,

        borderTop: p.bt ?? p.by ?? p.b,
        borderRight: p.br ?? p.bx ?? p.b,
        borderBottom: p.bb ?? p.by ?? p.b,
        borderLeft: p.bl ?? p.bx ?? p.b,

        borderTopRightRadius: p.rtr ?? p.rt ?? p.rr ?? p.r,
        borderTopLeftRadius: p.rtl ?? p.rt ?? p.rl ?? p.r,
        borderBottomRightRadius: p.rbr ?? p.rb ?? p.rr ?? p.r,
        borderBottomLeftRadius: p.rbl ?? p.rb ?? p.rl ?? p.r,

        width: p.w ?? p.s,
        height: p.h ?? p.s,
        maxWidth: p.maxW,
        maxHeight: p.maxH,
        minWidth: p.minW,
        minHeight: p.minH,

        ...p.style,
      }}
    >
      {children}
    </div>
  );
}
