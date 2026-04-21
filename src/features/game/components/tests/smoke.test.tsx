import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Players from "../Players";
import GameRoomView from "../GameRoomView";
import Chat from "../Chat";
import VersusBanner from "../VersusBanner";
import SpeechBalloon from "../SpeechBalloon";

describe("Players", () => {
  it("렌더링만 되어도 통과", () => {
    render(<Players />);
  });
});

describe("GameRoomView", () => {
  it("렌더링만 되어도 통과", () => {
    render(<GameRoomView />);
  });
});

describe("Chat", () => {
  it("렌더링만 되어도 통과", () => {
    render(<Chat />);
  });
});

describe("VersusBanner", () => {
  it("렌더링만 되어도 통과", () => {
    render(<VersusBanner />);
  });
});

describe("SpeechBalloon", () => {
  it("렌더링만 되어도 통과", () => {
    render(<SpeechBalloon />);
  });
});
