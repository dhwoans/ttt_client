import { ToastContainer } from "react-toastify";
import Marquee from "react-fast-marquee";
import Playing from "../../../pages/TicTacToe";
import Ready from "../../../pages/Ready";
import Bridge from "../../../shared/components/Bridge";
import HeaderLayout from "../../../pages/layouts/HeaderLayout";
import gameStart from "@assets/gameStart.png";
import type { GamePlayerInfo } from "../hooks/useRoomState";
import type { RoomPhase } from "../types";

interface GameRoomViewProps {
  nickname: string | null;
  phase: RoomPhase;
  playersInfos: GamePlayerInfo[];
  playersReadyStatus: Record<string, boolean>;
  mode: "single" | "multi";
  onReady: (isReady: boolean) => void;
  onExit: () => void;
  onRestart: () => void;
}

export default function GameRoomView({
  nickname,
  phase,
  playersInfos,
  playersReadyStatus,
  mode,
  onReady,
  onExit,
  onRestart,
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
          mode={mode}
        />
      )}
      {phase === "bridge" && <Bridge imageSrc={gameStart} />}
      {phase === "playing" && (
        <Playing
          playersInfos={playersInfos}
          mode={mode}
          onExit={onExit}
          onRestart={onRestart}
        />
      )}
    </>
  );
}
