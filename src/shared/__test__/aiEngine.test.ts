
import { describe, it, expect } from "vitest";
import { ticTacToeAI } from "../utils/AIPlayer";

describe("TicTacToe AI 엔진 테스트", () => {
  it("공격: 이길 수 있는 기회가 오면 승리하는 수를 두어야 한다", () => {
    const board = [
      ["X", "X", null],
      ["O", null, null],
      [null, null, "O"],
    ];
    const move = ticTacToeAI.getBestMove(board, "X", "O");
    expect(move).toEqual({ row: 0, col: 2 });
  });

  it("방어: 상대방의 승리 조합을 즉시 차단해야 한다", () => {
    const board = [
      ["O", "O", null],
      ["X", null, null],
      [null, null, null],
    ];
    const move = ticTacToeAI.getBestMove(board, "X", "O");
    expect(move).toEqual({ row: 0, col: 2 });
  });
});
