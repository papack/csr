import { jsx } from "../core/jsx";
import { Box } from "./box";
import type { BoxProps } from "./box";

/**
 * Fixed positioned component
 * Positions element relative to the viewport
 */
export interface FixedPropertiesInterface extends BoxProps {
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

export function Fixed(p: FixedPropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        position: "fixed",

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
