import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "../../../util/randomAvatar";
import { eventManager } from "../../../util/EventManager";
import { Avator } from "../../commonComponents/avator";

export default function CharacterBoard() {
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
    if (!fullNickname.trim()) return alert("닉네임을 확인하세요.");
    if (isCreating) return;

    const randomNum = crypto.randomUUID().toString().slice(0, 4);
    const finalName = `${fullNickname.trim()}${randomNum}`;
    const requestId = crypto.randomUUID();

    setIsCreating(true);

    // 이벤트 수신
    eventManager.once(`createUserResult:${requestId}`, (payload) => {
      setIsCreating(false);
      if (payload && payload.success) {
        // 성공 처리: payload.user 등 필요 데이터 사용 가능
        window.location.href = "/";
      } else {
        alert(payload?.error || "유저 생성에 실패했습니다.");
      }
    });

    // 유저생성 이벤트 발송
    eventManager.emit("createUser", { requestId, name: finalName });

    // (선택) 타임아웃으로 응답 없을 때 처리
    setTimeout(() => {
      if (isCreating) {
        setIsCreating(false);
        eventManager.off(`createUserResult:${requestId}`); // 안전하게 제거
        alert("서버 응답이 없습니다. 다시 시도하세요.");
      }
      return () => {
        setIsCreating(false);
      };
    }, 1000);
  };

  const brutalBox =
    "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`;

  return (
    <div>
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
        {/* 아바타  */}
        <Avator>{animalList[index][0]}</Avator>
        {/* 다음 버튼 */}
        <button
          onClick={() => setIndex((index + 1) % animalList.length)}
          className={`h-12 w-12 rounded-full text-2xl border-none font-bold ${brutalBtn}`}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-4 flex flex-row gap-4 ">
        <input
          type="textbox"
          value={fullNickname}
          onChange={handleNicknameChange}
          className={`basis-4/5 rounded-4xl text-center text-black outline-none bg-white`}
          spellCheck="false"
        />
        {/* 랜덤 버튼 */}
        <button
          onClick={randomIndex}
          className={`basis-1/5 rounded-2xl py-3 bg-blue-500 hover-zoom ${brutalBtn}`}
        >
          랜덤
        </button>
      </div>
      <div className="flex flex-col gap-4">
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
    </div>
  );
}
