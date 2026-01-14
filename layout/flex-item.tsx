import { jsx } from "../core/jsx";
import { Box } from "./box";
import type { BoxProps } from "./box";

/**
 * Flex item component
 * Controls individual item behavior in flex containers
 */
export interface FlexItemPropertiesInterface extends BoxProps {
  /**
   * Flex shorthand (grow, shrink, basis)
   * e.g. "1", "none", "0 1 auto"
   */
  flx?: string;

  /**
   * Align-self (cross-axis alignment)
   */
  as?: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";

  /**
   * Flex grow factor
   */
  flxGrow?: string;

  /**
   * Flex shrink factor
   */
  flxShrink?: string;

  /**
   * Flex basis
   */
  flxBasis?: string;
}

export function FlexItem(p: FlexItemPropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        flex: p.flx,
        alignSelf: p.as,
        flexGrow: p.flxGrow,
        flexShrink: p.flxShrink,
        flexBasis: p.flxBasis,

        ...p.style,
      }}
    >
      {children}
    </Box>
  );
}
