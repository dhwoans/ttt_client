import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";

// 예제용 컴포넌트
const GameBoard = ({ onMove }: { onMove: (position: number) => void }) => {
  const [board, setBoard] = React.useState(Array(9).fill(null));

  const handleClick = (index: number) => {
    if (board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);
      onMove(index);
    }
  };

  return (
    <div className="board">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          data-testid={`cell-${index}`}
        >
          {cell || "-"}
        </button>
      ))}
    </div>
  );
};

describe("게임 컴포넌트", () => {
  it("게임판 렌더링", () => {
    render(<GameBoard onMove={vi.fn()} />);

    const cells = screen.getAllByRole("button");
    expect(cells).toHaveLength(9);
    cells.forEach((cell) => {
      expect(cell).toHaveTextContent("-");
    });
  });

  it("셀 클릭 시 상태 변경", async () => {
    const handleMove = vi.fn();
    render(<GameBoard onMove={handleMove} />);

    const cell = screen.getByTestId("cell-0");
    cell.click();

    expect(cell).toHaveTextContent("X");
    expect(handleMove).toHaveBeenCalledWith(0);
  });

  it("이미 선택된 셀은 다시 선택 불가", async () => {
    const handleMove = vi.fn();
    render(<GameBoard onMove={handleMove} />);

    const cell = screen.getByTestId("cell-0");
    cell.click();
    cell.click();

    // 한 번만 호출됨
    expect(handleMove).toHaveBeenCalledOnce();
  });
});

import React from "react";
