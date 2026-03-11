import { useState, useEffect } from "react";
import JSConfetti from "js-confetti";
import { audioManager } from "@/shared/managers/AudioManager";
import hornsImg from "@assets/icons/Horns.png";
import thumbsDownImg from "@assets/icons/Thumbs_Down.png";
import handshakeImg from "@assets/icons/Handshake.png";

const WIN = hornsImg;
const LOOSE = thumbsDownImg;
const DRAW = handshakeImg;

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
  exitTime = 5000,
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
    // 자동 onExit 
    const timeoutId = setTimeout(onExit, exitTime);
    return () => clearTimeout(timeoutId);
  }, [winner, nickname]);

  return { result, imgSrc };
}
