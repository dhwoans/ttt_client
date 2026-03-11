import Board from "../features/game/components/Board";
import Players from "../features/game/components/Players";
import GameOverModal from "@/shared/modals/GameOverModal";
import Countdown from "@/shared/components/Countdown";
import ExitModal from "@/shared/modals/ExitModal";
import { useState, useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useGameState } from "../features/game/hooks/useGameState";
import { usePlayerMove } from "../features/game/hooks/usePlayerMove";
import { useAIMove } from "../features/game/hooks/useAIMove";
import { useGameTimeout } from "../features/game/hooks/useGameTimeout";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useSendPlayerMove } from "../features/game/hooks/useSendPlayerMove";
import { useSingleGameStore } from "@/stores/singleGameStore";
import { eventManager } from "@/shared/managers/EventManager";
import { gameSocketManager } from "@/shared/managers/SocketManager";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

interface SoloGamePageProps {
  playersInfos: GamePlayerInfo[];
  mode?: "single" | "multi";
  onExit?: () => void;
  onRestart?: () => void;
}
export default function Playing({
  playersInfos,
  mode = "single",
  onExit,
  onRestart,
}: SoloGamePageProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(
    () => sessionStorage.getItem("currentTurnPlayerId"),
  );
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const handleExitIntent = useCallback(() => {
    setShowExitModal(true);
  }, []);
  useBackExitModal(handleExitIntent, true);
  const handleExitCancel = () => setShowExitModal(false);
  const handleExit = () => {
    if (onExit) onExit();
  };

  // 게임 핸들러들
  const { handleRestart } = useGameRestart();
  const { sendMove } = useSendPlayerMove();
  const addTurn = useSingleGameStore((state) => state.addTurn);

  useEffect(() => {
    handleRestart();
    // 멀티 모드: 다른 플레이어의 이동 수신 및 게임 상태 업데이트
    if (mode === "multi") {
      const handleOpponentMove = (data: any) => {
        // OPPONENT_MOVE는 상대 이동을 알림
        console.log("[Playing] OPPONENT_MOVE 수신:", data);
      };

      const handleMoveMade = (data: any) => {
        // MOVE_MADE는 누군가 수를 놨을 때 모두에게 브로드캐스트됨
        console.log("[Playing] MOVE_MADE 수신:", data);
        const { connId, move } = data;

        // 대기 상태 해제
        setIsWaitingForServer(false);

        // connId로 플레이어 찾기
        const player = playersInfos.find((p) => p.userId === connId);
        if (!player) {
          console.warn("[Playing] MOVE_MADE: 플레이어를 찾을 수 없음", connId);
          return;
        }

        // 보드 인덱스를 행/열로 변환
        const row = Math.floor(move / 3);
        const col = move % 3;

        // 보드에는 플레이어 아바타(이모지)를 그대로 표시
        const symbol = player.avatar;

        // store에 turn 추가 (보드 상태 업데이트)
        addTurn({
          square: { row, col },
          symbol,
          nickname: player.nickname,
        });

        console.log("[Playing] turn 추가됨:", {
          row,
          col,
          symbol,
          nickname: player.nickname,
        });
      };

      const handleGameOver = (data: any) => {
        // 게임 종료
        console.log("[Playing] GAME_OVER 수신:", data);
      };

      const handleGameStateUpdate = (data: any) => {
        // 서버에서 모든 플레이어에게 게임 상태 업데이트
        // { roomId, status: "PLAYING", currentTurnPlayerId: state.players[state.currentTurn], players }
        if (data.currentTurnPlayerId) {
          setCurrentTurnPlayerId(data.currentTurnPlayerId);
          sessionStorage.setItem(
            "currentTurnPlayerId",
            data.currentTurnPlayerId,
          );
        }
      };

      const handleNextTurn = (data: any) => {
        if (data.nextPlayerId) {
          setCurrentTurnPlayerId(data.nextPlayerId);
          sessionStorage.setItem("currentTurnPlayerId", data.nextPlayerId);
        }
      };

      eventManager.on("OPPONENT_MOVE", handleOpponentMove);
      eventManager.on("MOVE_MADE", handleMoveMade);
      eventManager.on("GAME_OVER", handleGameOver);
      eventManager.on("GAME_STATE_UPDATE", handleGameStateUpdate);
      eventManager.on("NEXT_TURN", handleNextTurn);
      return () => {
        eventManager.off("OPPONENT_MOVE", handleOpponentMove);
        eventManager.off("MOVE_MADE", handleMoveMade);
        eventManager.off("GAME_OVER", handleGameOver);
        eventManager.off("GAME_STATE_UPDATE", handleGameStateUpdate);
        eventManager.off("NEXT_TURN", handleNextTurn);
      };
    }
  }, [mode, addTurn, playersInfos]);

  // 게임 상태 관리
  const {
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    currentPlayer,
    isPlayerTurn,
    turnStart,
    timeoutBy,
  } = useGameState(playersInfos);

  // 게임 핸들러들
  const { handleSquare: handleSquareSingle } = usePlayerMove(
    isGameOver,
    isPlayerTurn,
    playersInfos,
    turns,
  );
  useAIMove(isGameOver, isPlayerTurn, board, playersInfos, mode);
  const { handleTimeout } = useGameTimeout(currentPlayer.nickname);

  const sessionUserId = sessionStorage.getItem("userId");
  const socketConnId =
    sessionStorage.getItem("socketId") ??
    gameSocketManager.getSocket()?.id ??
    null;
  const isCurrentUserTurnByServer =
    !!currentTurnPlayerId &&
    (currentTurnPlayerId === sessionUserId ||
      currentTurnPlayerId === socketConnId);

  useEffect(() => {
    if (mode === "multi") {
      console.log("[Playing] 턴 정보:", {
        currentTurnPlayerId,
        sessionUserId,
        socketConnId,
        socketConnected: gameSocketManager.getSocket()?.connected,
        isCurrentUserTurnByServer,
        playersInfos: playersInfos.map((p) => ({
          nickname: p.nickname,
          userId: p.userId,
        })),
      });
    }
  }, [
    currentTurnPlayerId,
    sessionUserId,
    socketConnId,
    mode,
    isCurrentUserTurnByServer,
    playersInfos,
  ]);

  const currentTurnNicknameByServer =
    mode === "multi"
      ? isCurrentUserTurnByServer
        ? (playersInfos[0]?.nickname ?? "")
        : (playersInfos.find((player) => player.userId === currentTurnPlayerId)
            ?.nickname ?? "")
      : "";

  const turnNickname =
    mode === "multi" ? currentTurnNicknameByServer : currentPlayer.nickname;

  // 모드에 따라 다른 핸들러 사용
  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", {
        row,
        col,
        mode,
        isGameOver,
        isCurrentUserTurnByServer,
        currentTurnPlayerId,
      });
      if (mode === "multi") {
        // 멀티 모드: 서버에 좌표 전송
        // currentTurnPlayerId가 내 ID가 아니면 클릭 불가
        if (isGameOver || !isCurrentUserTurnByServer || isWaitingForServer) {
          console.log("[Playing] 클릭 거부:", {
            reason: isGameOver
              ? "gameOver"
              : !isCurrentUserTurnByServer
                ? "notYourTurn"
                : "waitingForServer",
          });
          return;
        }
        console.log("[Playing] sendMove 호출:", { row, col });
        setIsWaitingForServer(true);
        sendMove(row, col);
      } else {
        // 싱글 모드: 로컬 상태 업데이트
        handleSquareSingle(row, col);
      }
    },
    [
      mode,
      isGameOver,
      isCurrentUserTurnByServer,
      isWaitingForServer,
      currentTurnPlayerId,
      sendMove,
      handleSquareSingle,
    ],
  );

  const canSelectSquare =
    !isGameOver &&
    (mode === "multi"
      ? isCurrentUserTurnByServer && !isWaitingForServer
      : isPlayerTurn);

  return (
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 items-center md:items-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-12 flex flex-col items-center justify-center md:justify-center gap-4">
        <Players
          playerInfos={playersInfos}
          isTurn={!isGameOver && turnNickname}
        />
        {!isGameOver && (
          <Countdown
            durationMs={10000}
            format="mmss"
            className="text-3xl font-bold text-red-600"
            onComplete={mode === "single" ? handleTimeout : undefined}
            initialStartTime={turnStart}
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-1">
        <Board
          list={board}
          selectSquare={canSelectSquare ? handleSquare : false}
        />
      </div>

      {showExitModal && (
        <ExitModal
          onClose={handleExitCancel}
          sender={{ handleLeave: handleExit }}
        />
      )}

      {isGameOver && (turns.length > 0 || isTimeOver) && (
        <GameOverModal
          winner={
            isTimeOver
              ? timeoutBy
                ? playersInfos.find((p) => p.nickname !== timeoutBy)
                    ?.nickname || ""
                : ""
              : isDraw
                ? "DRAW"
                : winner
          }
          handleRestart={onRestart ?? handleRestart}
          onExit={handleExit}
        />
      )}
    </main>
  );
}
