import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";

// 예제용 Snapshot 컴포넌트
const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header>
    <h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </header>
);

describe("Snapshot 테스트", () => {
  it("헤더 컴포넌트 스냅샷", () => {
    const { container } = render(
      <Header title="게임" subtitle="Tic Tac Toe" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("타이틀만 있는 헤더 스냅샷", () => {
    const { container } = render(<Header title="로비" />);
    expect(container).toMatchSnapshot();
  });
});
