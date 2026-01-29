import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCharacterBoard } from "../hooks/useCharacterBoard";
import { apiManager } from "@/shared/utils/ApiManager";
import { animalList } from "@/shared/utils/randomAvatar";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/shared/hooks/useAudioEffect";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/shared/hooks/useAudioEffect", () => ({
  useAudio: vi.fn(),
}));

vi.mock("@/shared/utils/ApiManager", () => ({
  apiManager: {
    createUser: vi.fn(),
  },
}));

describe("useCharacterBoard Hook", () => {
  const mockNavigate = vi.fn();
  const mockPlayBeep = vi.fn();
  const mockPlayTick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAudio as any).mockReturnValue({
      playBeep: mockPlayBeep,
      playTick: mockPlayTick,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("초기 상태 검증", () => {
    it("state와 actions가 올바른 인터페이스 구조를 가져야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      expect(result.current).toHaveProperty("state");
      expect(result.current).toHaveProperty("actions");
    });

    it("초기 state 값이 올바르게 설정되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      expect(result.current.state.index).toBe(0);
      expect(result.current.state.isRandomizing).toBe(false);
      expect(result.current.state.isCreating).toBe(false);
      expect(result.current.state.shakeMotion).toBe(false);
      expect(result.current.state.fullNickname).toContain(" ");
      expect(result.current.state.fullNickname.length).toBeGreaterThan(0);
      expect(result.current.state.currentAvatar).toEqual(animalList[0]);
    });

    it("모든 action 메서드가 존재해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      expect(typeof result.current.actions.handleAvatarClick).toBe("function");
      expect(typeof result.current.actions.handleNavigateAvatar).toBe("function");
      expect(typeof result.current.actions.handleNicknameChange).toBe("function");
      expect(typeof result.current.actions.handleCreateUser).toBe("function");
      expect(typeof result.current.actions.handleAnimationEnd).toBe("function");
      expect(typeof result.current.actions.playBeep).toBe("function");
    });
  });

  describe("handleNicknameChange", () => {
    it("닉네임이 올바르게 변경되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "TestNickname" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.state.fullNickname).toBe("TestNickname");
    });

    it("빈 문자열도 허용해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.state.fullNickname).toBe("");
    });
  });

  describe("handleNavigateAvatar", () => {
    it("next 방향으로 아바타를 변경해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNavigateAvatar("next");
      });
      expect(result.current.state.index).toBe(1);
      expect(mockPlayTick).toHaveBeenCalledOnce();
    });

    it("prev 방향으로 아바타를 변경해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNavigateAvatar("prev");
      });
      expect(result.current.state.index).toBe(animalList.length - 1);
      expect(mockPlayTick).toHaveBeenCalledOnce();
    });

    it("마지막 아바타에서 next를 누르면 처음으로 돌아가야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        for (let i = 0; i < animalList.length; i++) {
          result.current.actions.handleNavigateAvatar("next");
        }
      });
      expect(result.current.state.index).toBe(0);
    });

    it("index 변경 시 닉네임이 자동 생성되어야 함", () => {
      const { result, rerender } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNavigateAvatar("next");
      });
      expect(result.current.state.index).toBe(1);
      rerender();
      expect(result.current.state.fullNickname).toContain(animalList[1][1]);
    });
  });

  describe("handleAvatarClick (랜덤화)", () => {
    it("클릭 시 isRandomizing이 true로 변경되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleAvatarClick();
      });
      expect(result.current.state.isRandomizing).toBe(true);
    });

    it("랜덤화 중에는 재클릭이 무시되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleAvatarClick();
        result.current.actions.handleAvatarClick();
      });
      expect(result.current.state.isRandomizing).toBe(true);
    });

    it("15회 회전 후 isRandomizing이 false로 변경되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleAvatarClick();
      });
      expect(result.current.state.isRandomizing).toBe(true);

      act(() => {
        vi.advanceTimersByTime(750);
      });

      expect(result.current.state.isRandomizing).toBe(false);
    });

    it("랜덤화 완료 후 index가 변경되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleAvatarClick();
        vi.advanceTimersByTime(750);
      });
      expect(result.current.state.index).toBeGreaterThanOrEqual(0);
      expect(result.current.state.index).toBeLessThan(animalList.length);
    });
  });

  describe("handleCreateUser", () => {
    it("닉네임이 비어있으면 shake 애니메이션 트리거", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      await act(async () => {
        await result.current.actions.handleCreateUser();
      });
      expect(result.current.state.shakeMotion).toBe(true);
      expect(apiManager.createUser).not.toHaveBeenCalled();
    });

    it("공백만 있는 닉네임도 거부해야 함", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "   " },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      await act(async () => {
        await result.current.actions.handleCreateUser();
      });
      expect(result.current.state.shakeMotion).toBe(true);
      expect(apiManager.createUser).not.toHaveBeenCalled();
    });

    it("유효한 닉네임으로 API 호출 성공 시 로비로 이동", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      (apiManager.createUser as any).mockResolvedValue({
        success: true,
        message: "user123",
      });

      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "ValidNickname" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.actions.handleCreateUser();
      });

      expect(apiManager.createUser).toHaveBeenCalledWith({
        nickname: "ValidNickname",
        profile: animalList[0][0],
      });

      expect(sessionStorage.getItem("avator")).toBe("0");
      expect(sessionStorage.getItem("nickname")).toBe("ValidNickname");
      expect(sessionStorage.getItem("userId")).toBe("user123");
      expect(mockNavigate).toHaveBeenCalledWith("/lobby", { replace: true });
    });

    it("API 호출 실패 시 shake 애니메이션 트리거", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      (apiManager.createUser as any).mockResolvedValue({
        success: false,
      });

      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "ValidNickname" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.actions.handleCreateUser();
      });

      expect(result.current.state.shakeMotion).toBe(true);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("API 에러 발생 시 shake 애니메이션 트리거", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      (apiManager.createUser as any).mockRejectedValue(
        new Error("Network Error"),
      );

      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "ValidNickname" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.actions.handleCreateUser();
      });

      expect(result.current.state.shakeMotion).toBe(true);
      expect(result.current.state.isCreating).toBe(false);
    });

    it("생성 중 재호출 방지", async () => {
      const { result } = renderHook(() => useCharacterBoard());
      (apiManager.createUser as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000)),
      );

      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "ValidNickname" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.actions.handleCreateUser();
      });

      const firstCallCount = (apiManager.createUser as any).mock.calls.length;

      await act(async () => {
        await result.current.actions.handleCreateUser();
      });

      expect((apiManager.createUser as any).mock.calls.length).toBe(
        firstCallCount,
      );
    });
  });

  describe("handleAnimationEnd", () => {
    it("shakeMotion을 false로 변경해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());

      act(() => {
        result.current.actions.handleNicknameChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.actions.handleCreateUser();
      });

      expect(result.current.state.shakeMotion).toBe(true);

      act(() => {
        result.current.actions.handleAnimationEnd();
      });

      expect(result.current.state.shakeMotion).toBe(false);
    });
  });

  describe("playBeep", () => {
    it("playBeep 액션이 useAudio의 playBeep을 호출해야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.playBeep();
      });
      expect(mockPlayBeep).toHaveBeenCalledOnce();
    });
  });

  describe("currentAvatar 동기화", () => {
    it("index 변경 시 currentAvatar가 동기화되어야 함", () => {
      const { result } = renderHook(() => useCharacterBoard());
      act(() => {
        result.current.actions.handleNavigateAvatar("next");
      });
      expect(result.current.state.currentAvatar).toEqual(animalList[1]);
    });
  });
});
