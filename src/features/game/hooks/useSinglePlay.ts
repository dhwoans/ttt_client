import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { clearGameSession } from "@/shared/utils/playerStorage";
import type { UseSinglePlayProps } from "../types/GameHookTypes";
import { useSingleInitialBotSetup } from "./useSingleInitialBotSetup";

const preprocessGameStart = (botInfo: unknown[]) => {
  localStorage.setItem(
    "gameState",
    JSON.stringify({
      phase: "playing",
      bot: botInfo,
      turnStart: Date.now(),
      moveHistory: [],
      timeoutBy: null,
    }),
  );
};

export function useSinglePlay({
  setPhase,
  playersInfos,
  setPlayersInfos,
}: UseSinglePlayProps) {
  const navigate = useNavigate();
  const bridgeTimerRef = useRef<number | null>(null);
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  useSingleInitialBotSetup({ playersInfos, setPlayersInfos });

  useEffect(() => {
    return () => {
      if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    };
  }, []);

  const handleReady = (isReady: boolean) => {
    if (isReady) {
      resetGame();
      setPhase("bridge");
      const bot = playersInfos[1];
      const botInfo = [bot?.avatar, bot?.nickname, bot?.imageSrc];
      preprocessGameStart(botInfo);
      bridgeTimerRef.current = window.setTimeout(
        () => setPhase("playing"),
        1500,
      );
    } else {
      setPhase("ready");
    }
  };

  const handleExit = () => {
    if (bridgeTimerRef.current) clearTimeout(bridgeTimerRef.current);
    resetGame();
    clearGameSession();
    navigate("/lobby", { replace: true });
  };

  return { handleReady, handleExit };
}
