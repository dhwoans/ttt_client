import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameModeGrid from "./components/GameModeGrid";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const nickname = sessionStorage.getItem("nickname");
    const userId = sessionStorage.getItem("userId");
    if (!nickname || !userId) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-6xl">
        <GameModeGrid />
      </div>
    </div>
  );
}
