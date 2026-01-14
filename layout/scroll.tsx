import { jsx } from "../core/jsx";
import { Relative } from "./relative";
import { Absolute } from "./absolute";
import type { BoxProps } from "./box";

/**
 * Scroll component
 * Creates a scrollable container filling its parent
 */
export interface ScrollPropertiesInterface extends BoxProps {}

export function Scroll(p: ScrollPropertiesInterface, children: any[]) {
  return (
    <Relative s="100%">
      <Absolute
        top="0"
        right="0"
        bottom="0"
        left="0"
        {...p}
        style={{
          overflow: "auto",
          ...p.style,
        }}
      >
        {children}
      </Absolute>
    </Relative>
  );
}
