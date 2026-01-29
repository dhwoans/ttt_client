export type CellSymbol = string | null;
export type Board = CellSymbol[][];

export interface Move {
  row: number;
  col: number;
}
