import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameModeGrid from "./components/GameModeGrid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl">
          <GameModeGrid />
        </div>
      </div>
    </>
  );
}
