import { useState, useEffect } from "react";
import dance_fricGIF from "/assets/Dance_fric.gif";
import loose_fricGIF from "/assets/loose_fric.gif";
import JSConfetti from "js-confetti";

export default function GameOverModal({
  sender,
  playerId,
  onRestart,
  onClose,
}) {
  const [result, setResult] = useState("무승부");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    // 승패 결정
    if (playerId !== "DRAW") {
      setResult(playerId === userId ? "승리" : "패배");
    }

    // 컨페티 효과
    const emoji = result === "승리" ? "🐸" : "💩";
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: [emoji],
      emojiSize: 30,
      confettiNumber: 50,
    });

    // 자동 나가기 타이머
    const timer = setTimeout(() => {
      handleExit();
    }, 5000);

    return () => clearTimeout(timer);
  }, [playerId, result]);

  const handleExit = () => {
    sender.handleLeave();
    sessionStorage.removeItem("PLAYING");
    window.sessionStorage.removeItem("roomId");
    window.location.href = "/";
  };

  const handleRestart = () => {
    if (onRestart) onRestart();
    if (onClose) onClose();
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
      <dialog
        open
        className="game-over bg-white rounded-2xl p-8 max-w-lg w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn"
      >
        <h2
          className={`result text-5xl font-black text-center mb-6 ${
            result === "승리"
              ? "text-green-600"
              : result === "패배"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {result}
        </h2>

        <img
          src={result === "승리" ? dance_fricGIF : loose_fricGIF}
          alt={result}
          className="w-64 h-64 mx-auto object-contain mb-6"
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRestart}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-accent hover:bg-yellow-400 ${brutalBtn}`}
          >
            다시하기
          </button>
          <button
            onClick={handleExit}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-gray-300 hover:bg-gray-400 ${brutalBtn}`}
          >
            나가기
          </button>
        </div>
      </dialog>
    </div>
  );
}
