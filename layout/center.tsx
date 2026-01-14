import { jsx } from "../core/jsx";
import { Flex } from "./flex";
import type { FlexPropertiesInterface } from "./flex";

/**
 * Center component
 * Centers children horizontally and vertically using flexbox
 */
export interface CenterPropertiesInterface extends FlexPropertiesInterface {}

export function Center(p: CenterPropertiesInterface, children: any[]) {
  return (
    <Flex {...p} ai={p.ai ?? "center"} jc={p.jc ?? "center"}>
      {children}
    </Flex>
  );
}
