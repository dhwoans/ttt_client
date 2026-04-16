import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Ready from "../../../pages/Ready";
import Bridge from "../../../shared/components/Bridge";
import HeaderLayout from "../../../pages/layouts/HeaderLayout";
import type { GamePlayerInfo, RoomPhase } from "../types/TicTacToeGameTypes";
import { ImageManager } from "@/shared/utils/ImageManger";
import LeftSideLayout from "@/pages/layouts/LeftSideLayout";

interface GameRoomViewProps {
  nickname: string | null;
  phase: RoomPhase;
  playersInfos: GamePlayerInfo[];
  playersReadyStatus: Record<string, boolean>;
  readyDisabled?: boolean;
  onReady: (isReady: boolean) => void;
  onExit: () => void;
  playingView: ReactNode;
}

export default function GameRoomView({
  nickname,
  phase,
  playersInfos,
  playersReadyStatus,
  readyDisabled = false,
  onReady,
  onExit,
  playingView,
}: GameRoomViewProps) {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <HeaderLayout>
        <Marquee
          autoFill
          className="w-full h-8 bg-white border-y-4 border-black text-black"
        >
          <span className="flex items-center gap-1 mr-40 font-bold text-sm">
            🎮 {nickname}
          </span>
        </Marquee>
      </HeaderLayout>
      {phase === "ready" && (
        <Ready
          onReady={onReady}
          onExit={onExit}
          playersInfos={playersInfos}
          playersReadyStatus={playersReadyStatus}
          readyDisabled={readyDisabled}
        />
      )}
      <LeftSideLayout className="-z-10 pointer-events-none">
        {/* 데코 상단 좌 */}
        <img
          className="-rotate-20 -translate-20 translate-y-50 blur-xs"
          src={ImageManager.ticTacToe}
          alt=""
          aria-hidden="true"
        />
      </LeftSideLayout>
      {phase === "bridge" && <Bridge imageSrc={ImageManager.gameStart} />}
      {phase === "playing" && playingView}
    </>
  );
}
