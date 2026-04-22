import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import {TimeoutProgressBar} from "../TimeoutProgressBar";

describe("TimeoutProgressBar", () => {
  it("렌더링만 되어도 통과", () => {
    render(<TimeoutProgressBar />);
  });
});
