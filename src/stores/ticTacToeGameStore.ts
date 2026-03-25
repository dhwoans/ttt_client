import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameMove {
  square: { row: number; col: number };
  symbol: string;
  nickname: string;
}

interface TicTacToeGameStoreState {
  moveHistory: GameMove[];
  timeoutBy: string | null;
  turnStart: number;

  addMove: (move: GameMove) => void;
  setTimeoutBy: (timeoutBy: string) => void;
  resetGame: () => void;
  clearTurnStart: () => void;
}

export const useTicTacToeGameStore = create<TicTacToeGameStoreState>()(
  persist(
    (set) => ({
      moveHistory: [],
      timeoutBy: null,
      turnStart: Date.now(),

      addMove: (move: GameMove) =>
        set((state) => ({
          moveHistory: [...state.moveHistory, move],
          turnStart: Date.now(),
        })),

      setTimeoutBy: (timeoutBy: string) =>
        set({
          timeoutBy,
          turnStart: undefined,
        }),

      resetGame: () =>
        set({
          moveHistory: [],
          timeoutBy: null,
          turnStart: Date.now(),
        }),

      clearTurnStart: () =>
        set({
          turnStart: undefined,
        }),
    }),
    {
      name: "tic-tac-toe-game-storage",
    },
  ),
);
