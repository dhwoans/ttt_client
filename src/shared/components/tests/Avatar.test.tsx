import  {Avatar}  from "../Avatar";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Avatar test", () => {
  it("children가 기본으로 렌더링된다", () => {
    render(<Avatar>🐸</Avatar>);
    expect(screen.getByText("🐸")).toBeInTheDocument();
  });

  it("children로 전달한 video를 렌더링한다", () => {
    render(
      <Avatar>
        <video src="/test-avatar.webm" />
      </Avatar>,
    );
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/test-avatar.webm");
  });
});
