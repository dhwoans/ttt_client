import { useState, useEffect } from "react";
import tictactoe from "/assets/Tic_Tac_Toe.gif";

export default function Ready({ sender }) {
  const [isReady, setIsReady] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleReady = () => {
    if (!isReady) {
      sender.handleReady(true);
      setIsReady(true);
      setShowProgress(true);
      setProgress(0);
      startProgressBar();
    } else {
      sender.handleReady(false);
      setIsReady(false);
      setShowProgress(false);
    }
  };

  const startProgressBar = () => {
    const duration = 5000;
    const interval = 50;
    const maxSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / maxSteps) * 100);

      if (currentStep >= maxSteps) {
        clearInterval(timer);
        setShowProgress(false);
      }
    }, interval);
  };

  const handleExit = () => {
    sender.handleLeave();
    window.sessionStorage.removeItem("roomId");
    window.location.href = "/";
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <img
        src={tictactoe}
        alt="Tic Tac Toe"
        className="w-64 h-64 object-contain animate__animated animate__bounceIn"
      />

      {showProgress ? (
        <div className="w-full max-w-md bg-gray-200 rounded-full h-6 border-4 border-black overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <button
          onClick={handleReady}
          className={`px-12 py-4 rounded-2xl text-xl font-black ${
            isReady
              ? "bg-red-500 hover:bg-red-600"
              : "bg-accent hover:bg-yellow-400 animate__animated animate__pulse animate__infinite"
          } ${brutalBtn}`}
        >
          {isReady ? "취소" : "준비"}
        </button>
      )}

      <button
        onClick={handleExit}
        className={`px-8 py-3 rounded-xl text-lg font-bold bg-gray-300 hover:bg-gray-400 ${brutalBtn}`}
      >
        나가기
      </button>
    </div>
  );
}
