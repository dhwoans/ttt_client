import { useState, useEffect } from "react";
import Board from "./components/Board";
import Ready from "./components/Ready";

export default function GameManager({ sender }) {
  const [isPlaying, setIsPlaying] = useState(
    sessionStorage.getItem("PLAYING") === "true" || false
  );

  useEffect(() => {
    console.log("playing:", isPlaying);
  }, [isPlaying]);

  return (
    <div id="game-container" className="flex items-center justify-center p-4">
      {isPlaying ? <Board /> : <Ready sender={sender} />}
    </div>
  );
}
