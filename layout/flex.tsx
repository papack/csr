import { jsx } from "../core/jsx";
import { FlexItem } from "./flex-item";
import type { FlexItemPropertiesInterface } from "./flex-item";

/**
 * Flex container component
 * Core flexbox layout primitive
 */
export interface FlexPropertiesInterface extends FlexItemPropertiesInterface {
  /**
   * Justify-content (main axis alignment)
   */
  jc?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

  /**
   * Align-items (cross axis alignment)
   */
  ai?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

  /**
   * Align-content (multi-line alignment)
   */
  ac?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "stretch";

  /**
   * Gap between items
   */
  g?: string;

  /**
   * Flex direction
   */
  flxDirection?: "row" | "row-reverse" | "column" | "column-reverse";

  /**
   * Flex wrap
   */
  flxWrap?: "nowrap" | "wrap" | "wrap-reverse";

  /**
   * Flex-flow shorthand
   */
  flxFlow?: `${"row" | "row-reverse" | "column" | "column-reverse"} ${
    | "nowrap"
    | "wrap"
    | "wrap-reverse"}`;
}

export function Flex(p: FlexPropertiesInterface, children: any[]) {
  return (
    <FlexItem
      {...p}
      style={{
        display: "flex",

        justifyContent: p.jc,
        alignItems: p.ai,
        alignContent: p.ac,

        gap: p.g,

        flexDirection: p.flxDirection,
        flexWrap: p.flxWrap,
        flexFlow: p.flxFlow,

        ...p.style,
      }}
    >
      {children}
    </FlexItem>
  );
}
