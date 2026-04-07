import LobbyMainLayout from "./layouts/LobbyMainLayout";
import Marquee from "react-fast-marquee";
import HeaderLayout from "./layouts/HeaderLayout";
import { ToastContainer } from "react-toastify";
import ticTacToe from "@assets/ticTacToe.png";
import click from "@assets/click.png";
import "react-toastify/dist/ReactToastify.css";
import FooterLayout from "./layouts/FooterLayout";
import LeftSideLayout from "./layouts/LeftSideLayout";

export default function LobbyPage() {
  const nickname = sessionStorage.getItem("nickname");

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
      <HeaderLayout className="z-30">
        <Marquee
          autoFill
          className="w-full h-8 bg-white border-y-4 border-black text-black"
        >
          <span className="flex items-center gap-1 mr-40 font-bold text-sm">
            {nickname}
          </span>
        </Marquee>
      </HeaderLayout>
      <LeftSideLayout className="z-10">
        {/* 데코 상단 좌 */}
        <img
          className="z-10 -rotate-20 -translate-20 translate-y-50"
          src={ticTacToe}
          alt=""
          aria-hidden="true"
        />
      </LeftSideLayout>
      <section className="relative z-20 flex min-h-screen items-center justify-center px-[10%]">
        <LobbyMainLayout />
      </section>
      <FooterLayout className="z-40 flex justify-end">
        <img
          className="pointer-events-none h-50 w-150 -rotate-10 translate-y-20 blur-xs"
          src={click}
        />
      </FooterLayout>
    </>
  );
}
