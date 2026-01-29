import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { CountdownHandle } from "../../utils/CountdownManager";

// 인터페이스를 구현하는 mock 클래스
class MockCountdown implements CountdownHandle {
  private remaining: number;
  private isRunning: boolean = false;
  private intervalId: number | null = null;

  constructor(private initialDuration: number) {
    this.remaining = initialDuration;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    // 실제 구현에서는 타이머를 시작
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);
  }

  reset(ms?: number): void {
    this.stop();
    this.remaining = ms ?? this.initialDuration;
  }

  getRemaining(): number {
    return this.remaining;
  }

  // 테스트용 헬퍼
  simulate(ms: number): void {
    if (this.isRunning) {
      this.remaining = Math.max(0, this.remaining - ms);
    }
  }
}

describe("countdown interface test", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("타이머가 시작되는지 검사", () => {
    const countdown = new MockCountdown(10000);

    expect(countdown.getRemaining()).toBe(10000);

    countdown.start();
    countdown.simulate(3000);

    expect(countdown.getRemaining()).toBe(7000);
  });

  it("타이머가 정지되는지 검사", () => {
    const countdown = new MockCountdown(10000);

    countdown.start();
    countdown.simulate(3000);
    expect(countdown.getRemaining()).toBe(7000);

    countdown.stop();
    countdown.simulate(2000);

    // stop 후에는 시간이 흐르지 않음
    expect(countdown.getRemaining()).toBe(7000);
  });

  it("타이머가 초기화 되는지 검사", () => {
    const countdown = new MockCountdown(10000);

    countdown.start();
    countdown.simulate(5000);
    expect(countdown.getRemaining()).toBe(5000);

    countdown.reset();

    expect(countdown.getRemaining()).toBe(10000);
  });

  it("남은 시간 검사", () => {
    const countdown = new MockCountdown(10000);

    const remaining = countdown.getRemaining();

    expect(remaining).toBe(10000);
    expect(typeof remaining).toBe("number");
  });
});
