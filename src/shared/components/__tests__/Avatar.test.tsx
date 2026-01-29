import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../../test/test-utils";
import Avatar from "../../../shared/components/Avatar";

describe("Avatar Component", () => {
  it("렌더링되는지 확인", () => {
    render(<Avatar name="Player1" />);
    expect(screen.getByText("Player1")).toBeInTheDocument();
  });

  it("클릭 이벤트 처리", async () => {
    const handleClick = vi.fn();
    render(<Avatar name="Player1" onClick={handleClick} />);

    const avatar = screen.getByText("Player1");
    fireEvent.click(avatar);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("커스텀 클래스 적용", () => {
    render(<Avatar name="Player1" className="custom-class" />);
    const element = screen.getByText("Player1").parentElement;

    expect(element).toHaveClass("custom-class");
  });
});
