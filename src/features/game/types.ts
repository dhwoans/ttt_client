export type CellSymbol = string | null;
export type Board = CellSymbol[][];
export type RoomPhase = "ready" | "bridge" | "playing";

export interface Move {
  row: number;
  col: number;
}
