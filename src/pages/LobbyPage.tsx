import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BentoGrid from "../features/lobby/components/BentoGrid";
import NicknameMarquee from "../features/lobby/components/NicknameMarquee";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LobbyPage() {
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
        position="bottom-left"
        autoClose={2000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <NicknameMarquee emoji="🎮" />
      <section className=" flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl">
          <BentoGrid />
        </div>
      </section>
    </>
  );
}
