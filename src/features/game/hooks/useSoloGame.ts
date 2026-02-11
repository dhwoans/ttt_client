import { useState, useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import {
  initialBoard,
  calcBoard,
  whoIsWin,
  TurnInfo,
} from "../util/ticTacToeUtils";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

/**
 * 솔로 게임 로직 관리 훅
 * - 턴 관리
 * - 승패 판정
 * - AI 처리
 * - 타임아웃 처리
 */
export function useSoloGame(playersInfos: GamePlayerInfo[]) {
  // 단일 상태 객체로 관리
  const getInitialState = () => {
    const saved = localStorage.getItem("singleGameState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // turns가 배열이 아니면 빈 배열로 보정
        if (!Array.isArray(parsed.turns)) {
          parsed.turns = [];
        }
        return parsed;
      } catch {
        // fall through
      }
    }
    return {
      turns: [],
      isTimeOver: false,
      timeoutBy: null,
      turnStart: Date.now(),
    };
  };
  const [gameState, setGameState] = useState(getInitialState);
  const { turns, isTimeOver, timeoutBy, turnStart } = gameState;

  const board = calcBoard(turns);
  const winner = whoIsWin(board, turns);
  const isDraw = turns.length === 9;
  const currentPlayer = playersInfos[turns.length % 2];
  const isTurn = currentPlayer.nickname;
  const isPlayerTurn = isTurn === playersInfos[0].nickname;
  const isGameOver = winner || isDraw || isTimeOver;

  // gameState가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    // Always save turnStart, even if turns is empty
    localStorage.setItem("singleGameState", JSON.stringify(gameState));
  }, [gameState]);

  // 턴이 바뀔 때마다 시작 시간 저장 
  // 플레이어가 수를 두는 핸들러
  const handleSquare = (row: number, col: number) => {
    if (isGameOver || !isPlayerTurn) return;
    setGameState((prev) => {
      const nextPlayer = playersInfos[prev.turns.length % 2];
      const nextTurn = [
        {
          square: { row, col },
          symbol: nextPlayer.avatar,
          nickname: nextPlayer.nickname,
        },
        ...prev.turns,
      ];
      return { ...prev, turns: nextTurn, turnStart: Date.now() };
    });
  };

  // 게임 재시작
  const handleRestart = () => {
    const newState = {
      ...gameState,
      turns: [],
      isTimeOver: false,
      timeoutBy: null,
      turnStart: Date.now(),
      phase: "playing",
    };
    setGameState(newState);
    localStorage.setItem("singleGameState", JSON.stringify(newState));
  };

  // 타임아웃 처리
  const handleTimeout = () => {
    setGameState((prev) => ({
      ...prev,
      isTimeOver: true,
      timeoutBy: currentPlayer.nickname,
      turnStart: undefined,
    }));
  };

  // AI 턴 처리
  useEffect(() => {
    if (isGameOver || isPlayerTurn) {
      return;
    }
    const aiTimer = setTimeout(() => {
      const playerSymbol = playersInfos[0].avatar;
      const botSymbol = playersInfos[1].avatar;
      const aiMove = ticTacToeAI.getBestMove(board, botSymbol, playerSymbol);
      if (aiMove) {
        setGameState((prev) => {
          const nextTurn = [
            {
              square: { row: aiMove.row, col: aiMove.col },
              symbol: botSymbol,
              nickname: playersInfos[1].nickname,
            },
            ...prev.turns,
          ];
          return { ...prev, turns: nextTurn, turnStart: Date.now() };
        });
      }
    }, 1000);
    return () => clearTimeout(aiTimer);
  }, [isTurn, isGameOver, board, playersInfos, isPlayerTurn]);

  // 새로고침 시에도 타임오버 유지
  // (불필요) isTimeOver 별도 저장 useEffect 제거

  return {
    // 게임 상태
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    isTurn,
    isPlayerTurn,
    turnStart,
    timeoutBy,

    // 핸들러
    handleSquare,
    handleRestart,
    handleTimeout,
  };
}
