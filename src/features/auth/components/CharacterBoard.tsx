import { Avatar } from "@/shared/components/Avatar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useReducer, useState } from "react";
import { useAudio } from "@/shared/hooks/useAudioEffect";
import { useAvatarSelection } from "../hooks/useAvatarSelection";
import { useNickname } from "../hooks/useNickname";
import { useCreateUserAndLobbyMove } from "../hooks/useCreateUserAndLobbyMove";
import Bridge from "@/shared/components/Bridge";

type ShakeAction = { type: "trigger" } | { type: "end" };

function shakeReducer(_: boolean, action: ShakeAction) {
  switch (action.type) {
    case "trigger":
      return true;
    case "end":
      return false;
    default:
      return false;
  }
}
const shakeClass = "animate__animated animate__shakeX";
const brutalBox =
  "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

export default function CharacterBoard() {
  const { playBeep } = useAudio();
  const { isCreating, handleCreateUser } = useCreateUserAndLobbyMove();

  const avatar = useAvatarSelection();
  const nickname = useNickname(avatar.index);
  const [isShaking, dispatchShake] = useReducer(shakeReducer, false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const triggerShake = () => {
    dispatchShake({ type: "trigger" });
  };

  const handleShakeAnimationEnd = () => {
    dispatchShake({ type: "end" });
  };

  if (isCreating) {
    return <Bridge />;
  }

  

  return (
    <div
      className={`mx-auto my-12 max-w-120 rounded-2xl bg-linear-to-b from-dark-1 to-dark-2 p-8 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
    ${isShaking ? shakeClass : ""}`}
      onAnimationEnd={handleShakeAnimationEnd}
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
          <button
            type="button"
            onClick={avatar.randomize}
            onMouseEnter={() => setIsAvatarHovered(true)}
            onMouseLeave={() => setIsAvatarHovered(false)}
            className="relative rounded-full hover:cursor-pointer"
          >
            <div
              className={`transition-all duration-200 ${
                isAvatarHovered ? "blur-[2px]" : ""
              }`}
            >
              <Avatar>
                <video
                  src={avatar.currentAvatar.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-40 h-40 object-cover"
                />
              </Avatar>
            </div>
            <div
              className={`pointer-events-none absolute inset-0 grid place-items-center text-8xl transition-opacity ${isAvatarHovered ? "opacity-100" : "opacity-0"}`}
            >
              ❓
            </div>
          </button>
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
        onClick={() =>
          handleCreateUser({
            nickname: nickname.fullNickname,
            avatarName: avatar.currentAvatar.nickname,
            avatarIndex: avatar.index,
            onError: triggerShake,
          })
        }
        disabled={isCreating}
        className={`w-full rounded-2xl py-4 font-black bg-accent text-xl text-dark-1 ${brutalBtn} ${
          isCreating ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        입장
      </button>
    </div>
  );
}
