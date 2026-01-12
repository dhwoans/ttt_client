import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "../../../shared/utils/randomAvatar";
import { eventManager } from "../../../shared/utils/EventManager";
import { Avatar } from "../../../shared/components/Avatar";
import { apiManager } from "../../../shared/utils/ApiManager";
import { useNavigate } from "react-router-dom";

export default function CharacterBoard() {
  const [shakeMotion, setShakeMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [fullNickname, setFullNickname] = useState(() => {
    return `${getRandomAdj()} ${animalList[0][1]}`;
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setFullNickname(`${getRandomAdj()} ${animalList[index][1]}`);
  }, [index]);

  const handleNicknameChange = (e) => {
    setFullNickname(e.target.value);
  };

  const randomIndex = () => {
    setIndex(Math.floor(Math.random() * animalList.length));
  };

  const handleCreateUser = async () => {
    if (!fullNickname.trim()) {
      setShakeMotion(true);
      return;
    }
    if (isCreating) return;
    setIsCreating(true);
    const result = await apiManager.createUser({
      nickname: fullNickname,
      profile: animalList[index][0],
    });

    // 이벤트 수신
    setIsCreating(false);
    if (result && result.success) {
      // 성공 처리: uuId
      sessionStorage.setItem("userId", result.message);
      const navigate = useNavigate();
      navigate("/lobby");
    } else {
      setShakeMotion(true);
      // alert(result?.message || "유저 생성에 실패했습니다.");
    }

    // 타임아웃 처리
    setTimeout(() => {
      if (isCreating) {
        setIsCreating(false);
        alert("서버 응답이 없습니다. 다시 시도하세요.");
      }
    }, 5000);
  };

  const shake = "animate__animated animate__shakeX";
  const brutalBox =
    "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`;

  return (
    <div
      className={`mx-auto my-12 max-w-120 rounded-2xl bg-linear-to-b from-dark-1 to-dark-2 p-8 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
    ${shakeMotion ? shake : ""}`}
      onAnimationEnd={() => setShakeMotion(false)}
    >
      <h2 className="mb-8 text-center text-3xl font-bold text-accent drop-shadow-md">
        CHARACTER SELECT
      </h2>

      <div className="mb-8 flex items-center justify-between gap-4">
        {/* 이전 버튼 */}
        <button
          onClick={() =>
            setIndex((index + animalList.length - 1) % animalList.length)
          }
          className={`h-12 w-12 rounded-full text-2xl border-none font-bold ${brutalBtn}`}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* 아바타  */}
          <Avatar onClick={() => randomIndex()}>{animalList[index][0]}</Avatar>
          <input
            type="text"
            name="nickname"
            value={fullNickname}
            onChange={handleNicknameChange}
            className={`rounded-2xl w-50 text-center text-lg text-black outline-none py-1 bg-white `}
            spellCheck="false"
          />
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => setIndex((index + 1) % animalList.length)}
          className={`h-12 w-12 rounded-full text-2xl border-none font-bold ${brutalBtn}`}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* 닉네임 입력 */}

      <button
        onClick={() => handleCreateUser()} // handleCreateUser 연결
        disabled={isCreating}
        className={`w-full rounded-2xl py-4 font-black bg-accent text-xl text-dark-1 hover-zoom ${brutalBtn} ${
          isCreating ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {isCreating ? "입장 중..." : "이 캐릭터로 입장"}
      </button>
    </div>
  );
}
