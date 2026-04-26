import { render, screen } from "@testing-library/react";
import {describe , it , expect } from "vitest"
import "@testing-library/jest-dom";
import Players from "../Players";

describe("Players", () => {
  it("renders player nicknames and avatars", () => {
    const mockPlayers = [
      { nickname: "cat", avatar: "🐱", imageSrc: "cat.png" },
      { nickname: "dog", avatar: "🐶", imageSrc: "dog.png" },
    ];
    render(<Players playerInfos={mockPlayers} isTurn="Alice" />);
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText("dog")).toBeInTheDocument();
    expect(screen.getByText("🐱")).toBeInTheDocument();
    expect(screen.getByText("🐶")).toBeInTheDocument();
  });
});
