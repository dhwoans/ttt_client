import { useState, useEffect } from "react";
import JSConfetti from "js-confetti";
import { audioManager } from "@/shared/managers/AudioManager";

const WIN = "/assets/icons/Horns.png";
const LOOSE = "/assets/icons/Thumbs_Down.png";
const DRAW = "/assets/icons/Handshake.png";

const triggerConfetti = (result: string) => {
  const emoji = result === "승리" ? "👍" : "💩";
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: [emoji],
    emojiSize: 80,
    confettiNumber: 10,
  });
};

interface UseGameResultProps {
  winner: string;
  onExit: () => void;
  exitTime?: number;
}

export function useGameResult({
  winner,
  onExit,
  exitTime = 10000,
}: UseGameResultProps) {
  console.log(winner);
  const nickname = sessionStorage.getItem("nickname");
  const [result, setResult] = useState("무승부");

  const imgSrc = result === "승리" ? WIN : result === "패배" ? LOOSE : DRAW;

  useEffect(() => {
    const resolved =
      winner !== "DRAW" ? (winner === nickname ? "승리" : "패배") : "무승부";

    if (resolved === "승리") {
      audioManager.play("win");
    }

    setResult(resolved);
    triggerConfetti(resolved);
    // 자동 onExit 제거: 사용자가 직접 나가기 버튼을 눌러야만 onExit 호출
    // const timeoutId = setTimeout(onExit, exitTime);
    // return () => clearTimeout(timeoutId);
  }, [winner, nickname]);

  return { result, imgSrc };
}
