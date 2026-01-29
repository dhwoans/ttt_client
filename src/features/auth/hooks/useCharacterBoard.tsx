import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "@/shared/utils/randomAvatar";
import { apiManager } from "@/shared/utils/ApiManager";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/shared/hooks/useAudioEffect";

interface CharacterBoardState {
  index: number;
  isRandomizing: boolean;
  fullNickname: string;
  isCreating: boolean;
  shakeMotion: boolean;
  currentAvatar: [string, string, string]; // [emoji, name, imageSrc]
}

interface CharacterBoardActions {
  handleAvatarClick: () => void;
  handleNavigateAvatar: (direction: "prev" | "next") => void;
  handleNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateUser: () => Promise<void>;
  handleAnimationEnd: () => void;
  playBeep: () => void;
}

interface CharacterBoardInterface {
  state: CharacterBoardState;
  actions: CharacterBoardActions;
}

export function useCharacterBoard(): CharacterBoardInterface {
  const navigate = useNavigate();
  const { playBeep, playTick } = useAudio();

  const [shakeMotion, setShakeMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [fullNickname, setFullNickname] = useState(() => {
    return `${getRandomAdj()} ${animalList[0][1]}`;
  });
  const [isCreating, setIsCreating] = useState(false);

  // 아바타 변경 시 닉네임 자동 생성
  useEffect(() => {
    setFullNickname(`${getRandomAdj()} ${animalList[index][1]}`);
  }, [index]);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullNickname(e.target.value);
  };

  // 아바타 랜덤 선택
  const handleAvatarClick = () => {
    if (isRandomizing) return;
    setIsRandomizing(true);

    let count = 0;
    const interval = setInterval(() => {
      setIndex(Math.floor(Math.random() * animalList.length));
      count++;

      if (count >= 15) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * animalList.length);
        setIndex(finalIndex);
        setIsRandomizing(false);
      }
    }, 50);
  };

  // 아바타 네비게이션 (이전/다음)
  const handleNavigateAvatar = (direction: "prev" | "next") => {
    playTick();
    const offset = direction === "prev" ? -1 : 1;
    setIndex(
      (prevIndex) =>
        (prevIndex + offset + animalList.length) % animalList.length,
    );
  };

  // 유저 생성 및 로비 이동
  const handleCreateUser = async () => {
    if (!fullNickname.trim()) {
      setShakeMotion(true);
      return;
    }
    if (isCreating) return;
    setIsCreating(true);

    try {
      const result = await apiManager.createUser({
        nickname: fullNickname,
        profile: animalList[index][0],
      });

      if (result && result.success) {
        sessionStorage.setItem("avator", String(index));
        sessionStorage.setItem("nickname", fullNickname);
        sessionStorage.setItem("userId", result.message);
        navigate("/lobby", { replace: true });
      } else {
        setShakeMotion(true);
      }
    } catch (error) {
      console.error("유저 생성 오류:", error);
      setShakeMotion(true);
    } finally {
      setIsCreating(false);
    }
  };

  // 애니메이션 종료 시 shake 상태 초기화
  const handleAnimationEnd = () => {
    setShakeMotion(false);
  };

  return {
    state: {
      index,
      isRandomizing,
      fullNickname,
      isCreating,
      shakeMotion,
      currentAvatar: animalList[index],
    },
    actions: {
      handleAvatarClick,
      handleNavigateAvatar,
      handleNicknameChange,
      handleCreateUser,
      handleAnimationEnd,
      playBeep,
    },
  };
}
