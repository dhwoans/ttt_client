import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendPlayerReady } from "./useSendPlayerReady";
import { useSendPlayerLeave } from "./useSendPlayerLeave";
import { useMultiplayerPlayers } from "./useMultiplayerPlayers";
import { useReceivePlayerReady } from "./useReceivePlayerReady";
import { useReceivePlayerLeave } from "./useReceivePlayerLeave";
import { useReadyTimeoutHandler } from "./useReadyTimeoutHandler";
import { useGamePhaseEvents } from "./useGamePhaseEvents";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { clearGameSession } from "@/shared/utils/playerStorage";
import type { GamePlayerInfo } from "./useRoomState";
import type { RoomPhase } from "../types";

interface UseMultiPlayProps {
  phase: RoomPhase;
  setPhase: (phase: RoomPhase) => void;
  setPlayersInfos: React.Dispatch<React.SetStateAction<GamePlayerInfo[]>>;
}

export function useMultiPlay({
  phase,
  setPhase,
  setPlayersInfos,
}: UseMultiPlayProps) {
  const navigate = useNavigate();
  const [playersReadyStatus, setPlayersReadyStatus] = useState<
    Record<string, boolean>
  >({});

  const { sendReady } = useSendPlayerReady();
  const { sendLeave } = useSendPlayerLeave();
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  useGamePhaseEvents(setPhase);
  //
  useMultiplayerPlayers(setPlayersInfos, setPlayersReadyStatus);
  useReceivePlayerReady(setPlayersReadyStatus);
  useReceivePlayerLeave(phase, setPlayersInfos, setPlayersReadyStatus);
  useReadyTimeoutHandler();

  const handleReady = (isReady: boolean) => {
    console.log("[room] handleReady 호출, isReady:", isReady);
    sendReady(isReady);
  };

  const handleExit = () => {
    sendLeave();
    resetGame();
    clearGameSession();
    navigate("/lobby");
  };

  return { handleReady, handleExit, playersReadyStatus, sendReady };
}
