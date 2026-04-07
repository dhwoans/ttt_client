import "@testing-library/jest-dom";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { render, screen, act } from "@testing-library/react";
import Countdown from "../Countdown";

describe("Countdown", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("턴 전환 시 10초 리셋 확인", () => {
    const { rerender } = render(<Countdown durationMs={10000} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText("6")).toBeInTheDocument();
    // 턴 전환(리셋) 시 durationMs 변경
    rerender(<Countdown durationMs={10000} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("0초 시 즉시 패배 처리(onComplete 호출) 확인", () => {
    const onComplete = vi.fn();
    render(<Countdown durationMs={2000} onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("새로고침 동기화(초기값 보정) 확인", () => {
    const now = Date.now();
    // 4초 경과 후 복귀 상황 가정
    render(<Countdown durationMs={10000} initialStartTime={now - 4000} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });
 
  it("3초 이하 시각적 강조 효과 작동 확인", () => {
    render(<Countdown durationMs={10000} />);
    // 7초 경과 → 3초 남음 → 강조 색상 적용
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    const el = screen.getByText("3");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({ color: "#ef4444" });
  });


  it("초 단위로 카운트다운이 표시된다", () => {
    render(<Countdown durationMs={3000} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("2")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("onComplete 콜백이 0초 도달 시 호출된다", () => {
    const onComplete = vi.fn();
    render(<Countdown durationMs={2000} onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("autoStart=false일 때 자동 시작되지 않는다", () => {
    render(<Countdown durationMs={5000} autoStart={false} />);
    // 시작 직후 시간이 줄지 않음
    expect(screen.getByText("5")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("initialStartTime이 주어지면 경과 시간만큼 줄어든다", () => {
    const now = Date.now();
    render(<Countdown durationMs={10000} initialStartTime={now - 4000} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});
