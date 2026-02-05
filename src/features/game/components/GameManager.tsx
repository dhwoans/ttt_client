import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SoloGamePage from "../../../pages/SoloGamePage";
import ReadyPage from "../../../pages/ReadyPage";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { randomBot } from "@/shared/utils/randomBot";
import { animalList } from "@/shared/utils/randomAvatar";
import Nav from "@/shared/components/Nav";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}
// GameManager는 "게임 세션 관리"만 담당(phase, 플레이어, 나가기 등)
// 실제 게임 UI/로직은 props로 주입받아 분리
export default function GameManager() {
  const navigate = useNavigate();
  const saved = localStorage.getItem("singleGameState");
  // 항상 자신의 정보는 0번 인덱스에 세팅
  const playerInfo = getPlayerInfoFromStorage();
  const myInfo: GamePlayerInfo = {
    nickname: playerInfo.nickname,
    avatar: animalList[playerInfo.avatarIndex][0],
    imageSrc: animalList[playerInfo.avatarIndex][2],
  };
  const [playersInfos, setPlayersInfos] = useState<GamePlayerInfo[]>([myInfo]);
  // phase 초기값을 localStorage에서 읽어서 결정
  let initialPhase: "ready" | "playing" = "ready";
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.phase === "playing") initialPhase = "playing";
    } catch {}
  }
  const [phase, setPhase] = useState<"ready" | "playing">(initialPhase);
  const location = useLocation();
  const mode = location.state?.mode || "single";

  const [showGameStart, setShowGameStart] = useState(false);
  const [gameStartDone, setGameStartDone] = useState(false);

  // 싱글플레이: 최초 렌더링 시 playersInfos 세팅
  useEffect(() => {
    if (mode === "single" && playersInfos.length === 1) {
      let initialBot: any = undefined;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.phase === "playing") initialPhase = "playing";
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

  const handleReady = () => {
    if (mode === "single") {
      setPhase("playing");
      const bot = playersInfos[1];
      localStorage.setItem(
        "singleGameState",
        JSON.stringify({
          phase: "playing",
          bot: [bot?.avatar, bot?.nickname, bot?.imageSrc],
          turnStart: Date.now(),
          turns: [],
          isTimeOver: false,
          timeoutBy: null,
        }),
      );
    } else {
      //ready 신호 서버로 보내기
      useEffect(() => {}, []);
    }
  };

  const handleExitConfirm = () => {
    localStorage.removeItem("singleGameState");
    navigate("/lobby", { replace: true });
  };

  return (
    <>
      <Nav />
      {phase === "ready" ? (
        <ReadyPage onReady={handleReady} playersInfos={playersInfos} />
      ) : (
        <SoloGamePage playersInfos={playersInfos} onExit={handleExitConfirm} />
      )}
    </>
  );
}
