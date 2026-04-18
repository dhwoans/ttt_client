import "@testing-library/jest-dom";
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Badge from "../Badge";

describe("Badge", () => {
  afterEach(() => {
    cleanup();
  });

  it("children 렌더링", () => {
    render(<Badge>테스트 배지</Badge>);

    expect(screen.getByText("테스트 배지")).toBeInTheDocument();
  });

  it("기본 color 클래스", () => {});

  it("커스텀 color prop 적용", () => {});

  it("스타일 클래스 적용", () => {});
});
