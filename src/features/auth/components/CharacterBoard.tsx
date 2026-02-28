import { Avatar } from "@/shared/components/Avatar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/shared/hooks/useAudioEffect";
import { useAvatarSelection } from "../hooks/useAvatarSelection";
import { useNickname } from "../hooks/useNickname";
import { useShakeAnimation } from "../hooks/useShakeAnimation";
import { useCreateUser } from "../hooks/useCreateUser";
import { useState } from "react";

export default function CharacterBoard() {
  const navigate = useNavigate();
  const { playBeep } = useAudio();
  const { createUser } = useCreateUser();
  
  const avatar = useAvatarSelection();
  const nickname = useNickname(avatar.index);
  const shake = useShakeAnimation();
  const [isCreating, setIsCreating] = useState(false);

  // 유저 생성 및 로비 이동
  const handleCreateUser = async () => {
    if (!nickname.fullNickname.trim()) {
      shake.trigger();
      return;
    }
    if (isCreating) return;
    setIsCreating(true);

    try {
      const result = await createUser({
        nickname: nickname.fullNickname,
        avatar: avatar.currentAvatar[0],
      });

      if (result && result.success) {
        sessionStorage.setItem("avator", String(avatar.index));
        sessionStorage.setItem("nickname", nickname.fullNickname);
        sessionStorage.setItem("userId", result.message);
        navigate("/lobby", { replace: true });
      } else {
        shake.trigger();
      }
    } catch (error) {
      console.error("유저 생성 오류:", error);
      shake.trigger();
    } finally {
      setIsCreating(false);
    }
  };

  const shakeClass = "animate__animated animate__shakeX";
  const brutalBox =
    "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <div
      className={`mx-auto my-12 max-w-120 rounded-2xl bg-linear-to-b from-dark-1 to-dark-2 p-8 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
    ${shake.isShaking ? shakeClass : ""}`}
      onAnimationEnd={shake.handleAnimationEnd}
    >
      <h2 className="mb-8 text-center text-3xl font-bold text-accent drop-shadow-md">
        CHARACTER SELECT
      </h2>
      <div className="mb-8 flex items-center justify-center gap-8">
        {/* 이전 버튼 */}
        <button
          onClick={() => avatar.navigate("prev")}
          className={`h-20 w-20 rounded-full text-2xl border-none font-bold flex items-center justify-center ${brutalBtn}`}
        >
          <ChevronLeft size={50} />
        </button>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* 아바타  */}
          <Avatar onClick={avatar.randomize} imageSrc={avatar.currentAvatar[2]}>
            {avatar.currentAvatar[0]}
          </Avatar>
          {/* 닉네임 입력 */}
          <input
            type="text"
            name="nickname"
            value={nickname.fullNickname}
            onChange={nickname.handleChange}
            className={`rounded-2xl w-50 text-center text-lg text-black outline-none py-1 bg-white `}
            spellCheck="false"
          />
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => avatar.navigate("next")}
          className={`h-20 w-20 rounded-full border-none flex items-center justify-center ${brutalBtn}`}
        >
          <ChevronRight size={50} />
        </button>
      </div>
      <button
        onMouseDown={playBeep}
        onClick={handleCreateUser}
        disabled={isCreating}
        className={`w-full rounded-2xl py-4 font-black bg-accent text-xl text-dark-1 ${brutalBtn} ${
          isCreating ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {isCreating ? "입장 중..." : "이 캐릭터로 입장"}
      </button>
    </div>
  );
}
