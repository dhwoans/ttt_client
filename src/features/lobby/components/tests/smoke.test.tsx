import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import SingleMode from "../SingleMode";
import SettingsAndLogout from "../SettingsAndLogout";
import PlayerInfo from "../PlayerInfo";
import MultiMode from "../MultiMode";
import LocalMode from "../LocalMode";

describe("SingleMode", () => {
  it("렌더링만 되어도 통과", () => {
    render(<SingleMode />);
  });
});

describe("SettingsAndLogout", () => {
  it("렌더링만 되어도 통과", () => {
    render(<SettingsAndLogout />);
  });
});

describe("PlayerInfo", () => {
  it("렌더링만 되어도 통과", () => {
    render(<PlayerInfo />);
  });
});

describe("MultiMode", () => {
  it("렌더링만 되어도 통과", () => {
    render(<MultiMode />);
  });
});

describe("LocalMode", () => {
  it("렌더링만 되어도 통과", () => {
    render(<LocalMode />);
  });
});
