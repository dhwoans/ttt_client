// moved from ../GameBoard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Board from "../Board";

const emptyBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const filledBoard = [
  ["X", "O", null],
  [null, "X", null],
  [null, null, "O"],
];

describe("Board", () => {
  it("보드에 9개 버튼 렌더링", () => {
    render(<Board list={emptyBoard} selectSquare={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("채워진 셀의 값이 화면에 표시", () => {
    render(<Board list={filledBoard} selectSquare={vi.fn()} />);
    expect(screen.getAllByText("X")).toHaveLength(2);
    expect(screen.getAllByText("O")).toHaveLength(2);
  });

  it("채워진 셀 버튼은 비활성화", () => {
    render(<Board list={filledBoard} selectSquare={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    // filledBoard 기준: X, O, null, null, X, null, null, null, O → 4개 비활성화
    const disabledButtons = buttons.filter((btn) =>
      btn.hasAttribute("disabled"),
    );
    expect(disabledButtons).toHaveLength(4);
  });

  it("빈 셀 클릭 시 selectSquare가 올바른 좌표와 함께 호출된다", async () => {
    const selectSquare = vi.fn();
    render(<Board list={emptyBoard} selectSquare={selectSquare} />);
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[4]);
    expect(selectSquare).toHaveBeenCalledWith(1, 1);
  });
});
