import { jsx } from "../core/jsx";
import type { DOMAttrs, DOMEvents, MaybeSignal, CSSValue } from "../core/dom";

/**
 * Text component
 * Typographic primitive for rendering text elements
 */
export interface TextPropertiesInterface extends DOMAttrs, DOMEvents {
  /** Text content */
  children?: any;

  /**
   * HTML tag to render
   * @default "p"
   */
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // ─────────────────────────────
  // Text styling
  // ─────────────────────────────

  /** Text alignment */
  a?: MaybeSignal<"left" | "right" | "center" | "justify">;

  /** Font family */
  ff?: MaybeSignal<CSSValue>;

  /** Font weight */
  fw?: MaybeSignal<CSSValue>;

  /** Font size */
  fs?: MaybeSignal<CSSValue>;

  /** Line height */
  lh?: MaybeSignal<CSSValue>;

  /** Letter spacing */
  ls?: MaybeSignal<CSSValue>;

  /** Font style */
  s?: MaybeSignal<"normal" | "italic">;

  /** Text color */
  c?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Spacing – Margin
  // ─────────────────────────────

  m?: MaybeSignal<CSSValue>;
  mb?: MaybeSignal<CSSValue>;
  ml?: MaybeSignal<CSSValue>;
  mr?: MaybeSignal<CSSValue>;
  mt?: MaybeSignal<CSSValue>;
  mx?: MaybeSignal<CSSValue>;
  my?: MaybeSignal<CSSValue>;

  // ─────────────────────────────
  // Spacing – Padding
  // ─────────────────────────────

  p?: MaybeSignal<CSSValue>;
  pb?: MaybeSignal<CSSValue>;
  pl?: MaybeSignal<CSSValue>;
  pr?: MaybeSignal<CSSValue>;
  pt?: MaybeSignal<CSSValue>;
  px?: MaybeSignal<CSSValue>;
  py?: MaybeSignal<CSSValue>;

  /** Background */
  bg?: MaybeSignal<CSSValue>;
}

export function Text(p: TextPropertiesInterface, children: any[]) {
  const Tag = p.tag ?? "p";

  return jsx(
    Tag,
    {
      ...p,
      style: {
        textAlign: p.a,
        fontFamily: p.ff,
        fontWeight: p.fw,
        fontSize: p.fs,
        lineHeight: p.lh,
        letterSpacing: p.ls,
        fontStyle: p.s,
        color: p.c,

        margin: p.m,
        marginBottom: p.mb ?? p.my ?? p.m,
        marginLeft: p.ml ?? p.mx ?? p.m,
        marginRight: p.mr ?? p.mx ?? p.m,
        marginTop: p.mt ?? p.my ?? p.m,

        padding: p.p,
        paddingBottom: p.pb ?? p.py ?? p.p,
        paddingLeft: p.pl ?? p.px ?? p.p,
        paddingRight: p.pr ?? p.px ?? p.p,
        paddingTop: p.pt ?? p.py ?? p.p,

        background: p.bg,
        ...p.style,
      },
    },
    ...children,
  );
}
