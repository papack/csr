import { jsx } from "../core/jsx";
import { Box } from "./box";
import type { BoxProps } from "./box";

/**
 * Relative positioned component
 * Establishes a positioning context for absolute children
 */
export interface RelativePropertiesInterface extends BoxProps {
  /**
   * Stacking order (z-index)
   * (e.g. "1", "auto", "var(--z-index-modal)")
   */
  zIndex?: string;
}

export function Relative(p: RelativePropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        position: "relative",
        zIndex: p.zIndex,

        ...p.style,
      }}
    >
      {children}
    </Box>
  );
}
