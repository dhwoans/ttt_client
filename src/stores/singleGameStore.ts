import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

interface GameTurn {
  square: { row: number; col: number };
  symbol: string;
  nickname: string;
}

interface SingleGameState {
  turns: GameTurn[];
  isTimeOver: boolean;
  timeoutBy: string | null;
  turnStart: number;

  // Actions
  addTurn: (turn: GameTurn) => void;
  setTimeOver: (timeoutBy: string) => void;
  resetGame: () => void;
  clearTurnStart: () => void;
}

export const useSingleGameStore = create<SingleGameState>()(
  persist(
    (set) => ({
      turns: [],
      isTimeOver: false,
      timeoutBy: null,
      turnStart: Date.now(),

      addTurn: (turn: GameTurn) =>
        set((state) => ({
          turns: [...state.turns, turn],
          turnStart: Date.now(),
        })),

      setTimeOver: (timeoutBy: string) =>
        set({
          isTimeOver: true,
          timeoutBy,
          turnStart: undefined,
        }),

      resetGame: () =>
        set({
          turns: [],
          isTimeOver: false,
          timeoutBy: null,
          turnStart: Date.now(),
        }),

      clearTurnStart: () =>
        set({
          turnStart: undefined,
        }),
    }),
    {
      name: "single-game-storage",
    },
  ),
);
