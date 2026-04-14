export type CellSymbol = string | null;
export type Board = CellSymbol[][];
export type RoomPhase = "ready" | "bridge" | "playing";

export interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

export interface Move {
  row: number;
  col: number;
}
