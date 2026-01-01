import { useState, useEffect } from "react";
import { animalList, getRandomAdj } from "../../util/randomAvatar";

export default function CharacterBoard() {
  const [index, setIndex] = useState(0);
  const [fullNickname, setFullNickname] = useState(() => {
    return `${getRandomAdj()} ${animalList[0][1]}`;
  });

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

    const randomNum = crypto.randomUUID().toString().slice(0, 4);
    const finalName = `${fullNickname.trim()}${randomNum}`;

    // 유저 생성 요청
    const result = await createUser(finalName);
    sessionStorage.setItem("userId", result);
    sessionStorage.setItem("nickname", finalName);
    window.location.href = "/";
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
        <div
          className={`flex h-50 w-50 items-center justify-center rounded-full bg-white text-9xl`}
        >
          {animalList[index][0]}
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
      <div className="mb-8 flex flex-row gap-4 ">
        <input
          type="text"
          value={fullNickname}
          onChange={handleNicknameChange}
          className={`basis-4/5 rounded-2xl py-3 text-center text-xl text-black font-bold outline-none bg-white`}
          spellCheck="false"
        />
        {/* 랜덤 버튼 */}
        <button
          onClick={randomIndex}
          className={`basis-1/5 rounded-2xl py-3 font-bold bg-blue-500 ${brutalBtn}`}
        >
          랜덤 생성
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => console.log("입장 로직")} // handleCreateUser 연결
          className={`w-full rounded-2xl py-4 text-xl font-black bg-accent text-dark-1 hover:bg-danger hover:text-white ${brutalBtn}`}
        >
          이 캐릭터로 입장
        </button>
      </div>
    </div>
  );
}
