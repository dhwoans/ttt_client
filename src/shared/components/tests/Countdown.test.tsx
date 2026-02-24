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

  it("탭 전환 후 복귀 시 시간 동기화(초기값 보정) 확인", () => {
    const now = Date.now();
    // 4초 경과 후 복귀 상황 가정
    render(<Countdown durationMs={10000} initialStartTime={now - 4000} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  // 아래 항목은 실제 UI/로직 구현 필요
  it("3초 이하 시각적 강조 효과 작동 확인 (미구현, TODO)", () => {
    // TODO: 3초 이하에서 className/style/애니메이션 등 강조 효과가 있으면 테스트 추가
  });

  it('0초 시 "Time Out!" 텍스트 표시 확인 (미구현, TODO)', () => {
    // TODO: 0초에 "Time Out!" 텍스트가 표시되는 경우 테스트 추가
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

  it("mm:ss 포맷이 정상적으로 표시된다", () => {
    render(<Countdown durationMs={65000} format="mmss" />);
    expect(screen.getByText("1:05")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("1:00")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByText("0:00")).toBeInTheDocument();
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
