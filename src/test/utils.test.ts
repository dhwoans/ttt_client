import { describe, it, expect, beforeEach, vi } from "vitest";

// 유틸리티 함수 예제
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const calculateScore = (wins: number, losses: number): number => {
  return wins * 10 - losses * 5;
};

describe("유틸리티 함수 테스트", () => {
  describe("validateEmail", () => {
    it("유효한 이메일", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("유효하지 않은 이메일 - @ 없음", () => {
      expect(validateEmail("testexample.com")).toBe(false);
    });

    it("유효하지 않은 이메일 - 도메인 없음", () => {
      expect(validateEmail("test@")).toBe(false);
    });

    it("유효하지 않은 이메일 - 공백 포함", () => {
      expect(validateEmail("test @example.com")).toBe(false);
    });
  });

  describe("calculateScore", () => {
    it("점수 계산", () => {
      expect(calculateScore(5, 2)).toBe(40);
    });

    it("패배만 있는 경우", () => {
      expect(calculateScore(0, 5)).toBe(-25);
    });

    it("승리만 있는 경우", () => {
      expect(calculateScore(10, 0)).toBe(100);
    });
  });
});
