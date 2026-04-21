import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import AuthGuard from "../AuthGuard";
import GuestGuard from "../GuestGuard";

// 간단 렌더링 smoke test

describe("AuthGuard", () => {
  it("렌더링만 되어도 통과", () => {
    render(<AuthGuard />);
  });
});

describe("GuestGuard", () => {
  it("렌더링만 되어도 통과", () => {
    render(<GuestGuard />);
  });
});
