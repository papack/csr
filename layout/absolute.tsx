import { Box } from "./box";
import { jsx } from "../core/jsx";
import type { BoxProps } from "./box";

/**
 * Absolute positioned component
 * Positions element absolutely within the nearest positioned ancestor
 */
export interface AbsolutePropertiesInterface extends BoxProps {
  /**
   * Distance from top edge of containing block
   * (e.g. "10px", "1rem", "5%")
   */
  top?: string;

  /**
   * Distance from right edge of containing block
   * (e.g. "10px", "1rem", "5%")
   */
  right?: string;

  /**
   * Distance from bottom edge of containing block
   * (e.g. "10px", "1rem", "5%")
   */
  bottom?: string;

  /**
   * Distance from left edge of containing block
   * (e.g. "10px", "1rem", "5%")
   */
  left?: string;
}

export function Absolute(p: AbsolutePropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        position: "absolute",

        top: p.top,
        right: p.right,
        bottom: p.bottom,
        left: p.left,

        ...p.style,
      }}
    >
      {children}
    </Box>
  );
}
