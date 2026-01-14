import { jsx } from "../core/jsx";
import { GridItem } from "./grid-item";
import type { GridItemPropertiesInterface } from "./grid-item";

/**
 * Grid container component
 * Core CSS Grid layout primitive
 */
export interface GridPropertiesInterface extends GridItemPropertiesInterface {
  /** Gap between grid items */
  g?: string;

  /** Align-items (block axis) */
  ai?: "stretch" | "start" | "end" | "center" | "baseline";

  /** Justify-items (inline axis) */
  ji?: "stretch" | "start" | "end" | "center" | "baseline";

  /** Align-self (container as grid item) */
  as?:
    | "auto"
    | "normal"
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "self-start"
    | "self-end"
    | "flex-start"
    | "flex-end"
    | "left"
    | "right";

  // Grid templates
  grdTemplateColumns?: string;
  grdTemplateRows?: string;
  grdTemplateAreas?: string;
  grdTemplate?: string;

  // Auto grid
  grdAutoColumns?: string;
  grdAutoRows?: string;
  grdAutoFlow?: "row" | "column" | "row dense" | "column dense";

  // Placement
  grd?: string;
  grdRowStart?: string;
  grdColumnStart?: string;
  grdRowEnd?: string;
  grdColumnEnd?: string;
  grdRow?: string;
  grdColumn?: string;

  // Gaps
  grdRowGap?: string;
  grdColumnGap?: string;
}

export function Grid(p: GridPropertiesInterface, children: any[]) {
  return (
    <GridItem
      {...p}
      style={{
        display: "grid",

        gap: p.g,

        alignItems: p.ai,
        justifyItems: p.ji,
        alignSelf: p.as,

        gridTemplateColumns: p.grdTemplateColumns,
        gridTemplateRows: p.grdTemplateRows,
        gridTemplateAreas: p.grdTemplateAreas,
        gridTemplate: p.grdTemplate,

        gridAutoColumns: p.grdAutoColumns,
        gridAutoRows: p.grdAutoRows,
        gridAutoFlow: p.grdAutoFlow,

        gridArea: p.grd,
        gridRowStart: p.grdRowStart,
        gridColumnStart: p.grdColumnStart,
        gridRowEnd: p.grdRowEnd,
        gridColumnEnd: p.grdColumnEnd,
        gridRow: p.grdRow,
        gridColumn: p.grdColumn,

        rowGap: p.grdRowGap,
        columnGap: p.grdColumnGap,

        ...p.style,
      }}
    >
      {children}
    </GridItem>
  );
}
