import { useState, useEffect } from "react";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { randomBot } from "@/shared/constants/randomBot";
import { animalList } from "@/shared/constants/randomAvatar";
import { useLocation } from "react-router-dom";

export interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

export function useRoomState() {
  const saved = localStorage.getItem("singleGameState");
  const playerInfo = getPlayerInfoFromStorage();
  const myInfo: GamePlayerInfo = {
    nickname: playerInfo.nickname,
    avatar: animalList[playerInfo.avatarIndex][0],
    imageSrc: animalList[playerInfo.avatarIndex][2],
  };
  const [playersInfos, setPlayersInfos] = useState<GamePlayerInfo[]>([myInfo]);
  const [phase, setPhase] = useState<"ready" | "playing">(() => {
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phase === "playing") return "playing";
      } catch {}
    }
    return "ready";
  });
  const location = useLocation();
  const [mode, setMode] = useState<string>(
    () => location.state?.mode || "single",
  );

  useEffect(() => {
    if (mode === "single" && playersInfos.length === 1) {
      let initialBot: any = undefined;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.bot) initialBot = parsed.bot;
        } catch {}
      }
      let randomBotData: any;
      if (initialBot) {
        randomBotData = initialBot;
      } else {
        randomBotData = randomBot();
      }
      setPlayersInfos([
        myInfo,
        {
          nickname: randomBotData[1],
          avatar: randomBotData[0],
          imageSrc: randomBotData[2],
        },
      ]);
    }
    // 멀티플레이는 소켓 등에서 setPlayersInfos로 갱신 (상대방만 추가)
  }, [mode, saved, playersInfos.length, myInfo]);

  return {
    playersInfos,
    setPlayersInfos,
    phase,
    setPhase,
    mode,
    setMode,
  };
}
