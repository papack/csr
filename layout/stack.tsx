import { Flex } from "./flex";
import { jsx } from "../core";
import type { FlexPropertiesInterface } from "./flex";

/**
 * Stack component
 * Vertical layout primitive (flex-direction: column by default)
 */
export interface StackPropertiesInterface extends FlexPropertiesInterface {}

export function Stack(p: StackPropertiesInterface, children: any[]) {
  return (
    <Flex {...p} flxDirection={p.flxDirection ?? "column"}>
      {children}
    </Flex>
  );
}
