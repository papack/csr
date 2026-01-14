import { jsx } from "../core/jsx";
import { Box } from "./box";
import type { BoxProps } from "./box";

/**
 * Sticky positioned component
 * Sticks to a position within its scroll container
 */
export interface StickyPropertiesInterface extends BoxProps {
  /** Top offset (e.g. "10px") */
  top?: string;

  /** Right offset */
  right?: string;

  /** Bottom offset */
  bottom?: string;

  /** Left offset */
  left?: string;

  /** Stacking order (z-index) */
  zIndex?: string;
}

export function Sticky(p: StickyPropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        position: "sticky",

        top: p.top,
        right: p.right,
        bottom: p.bottom,
        left: p.left,
        zIndex: p.zIndex,

        ...p.style,
      }}
    >
      {children}
    </Box>
  );
}
