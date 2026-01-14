import { jsx } from "../core/jsx";
import type { DOMAttrs, DOMEvents } from "../core/dom";

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
  a?: "left" | "right" | "center" | "justify";

  /** Font family */
  ff?: string;

  /** Font weight */
  fw?: number;

  /** Font size */
  fs?: string;

  /** Line height */
  lh?: string;

  /** Letter spacing */
  ls?: string;

  /** Font style */
  s?: "normal" | "italic";

  /** Text color */
  c?: string;

  // ─────────────────────────────
  // Spacing – Margin
  // ─────────────────────────────

  m?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  mt?: string;
  mx?: string;
  my?: string;

  // ─────────────────────────────
  // Spacing – Padding
  // ─────────────────────────────

  p?: string;
  pb?: string;
  pl?: string;
  pr?: string;
  pt?: string;
  px?: string;
  py?: string;

  /** Background */
  bg?: string;
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
      },
    },
    ...children
  );
}
