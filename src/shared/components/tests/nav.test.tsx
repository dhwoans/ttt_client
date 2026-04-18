import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { animalList } from "@/shared/constants/avatarCandidates";
import Nav from "../Nav";

describe("Nav", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });

  it("렌더링 테스트", () => {
    render(<Nav />);

    expect(screen.getByText("플레이어")).toBeInTheDocument();
  });

  it("sessionStorage의 nickname 표시", () => {
    sessionStorage.setItem("nickname", "frag");

    render(<Nav />);

    expect(screen.getByText("frag")).toBeInTheDocument();
  });
});
