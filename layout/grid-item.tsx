import { jsx } from "../core/jsx";
import { Box } from "./box";
import type { BoxProps } from "./box";

/**
 * Grid item component
 * Controls individual item placement inside CSS Grid containers
 */
export interface GridItemPropertiesInterface extends BoxProps {
  /**
   * Grid area name or shorthand
   * (e.g. "header", "1 / 1 / 3 / 2")
   */
  grdArea?: string;

  /**
   * Grid column placement
   * (e.g. "1 / span 2", "sidebar")
   */
  grdColumn?: string;

  /**
   * Grid row placement
   * (e.g. "1 / span 3", "content")
   */
  grdRow?: string;
}

export function GridItem(p: GridItemPropertiesInterface, children: any[]) {
  return (
    <Box
      {...p}
      style={{
        gridArea: p.grdArea,
        gridColumn: p.grdColumn,
        gridRow: p.grdRow,

        ...p.style,
      }}
    >
      {children}
    </Box>
  );
}
