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
      <h2 className="mb-8 text-center text-3xl font-bold text-[#f8c031] drop-shadow-md">
        CHARACTER SELECT
      </h2>

      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={() =>
            setIndex((index + animalList.length - 1) % animalList.length)
          }
          className={`h-12 w-12 rounded-full bg-white text-2xl font-bold ${brutalBtn}`}
        >
          {"<"}
        </button>

        <div
          className={`flex h-32 w-32 items-center justify-center rounded-2xl bg-white text-5xl ${brutalBox}`}
        >
          {animalList[index][0]}
        </div>

        <button
          onClick={() => setIndex((index + 1) % animalList.length)}
          className={`h-12 w-12 rounded-full bg-white text-2xl font-bold ${brutalBtn}`}
        >
          {">"}
        </button>
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-8">
        <input
          type="text"
          value={fullNickname}
          onChange={handleNicknameChange}
          className={`w-full rounded-2xl px-4 py-3 text-center text-xl font-bold outline-none ${brutalBox}`}
          spellCheck="false"
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={randomIndex}
          className={`w-full rounded-2xl bg-white py-3 font-bold text-[#383624] ${brutalBtn}`}
        >
          랜덤 닉네임 생성
        </button>

        <button
          onClick={() => console.log("입장 로직")} // handleCreateUser 연결
          className={`w-full rounded-2xl bg-[#f8c031] py-4 text-xl font-black text-[#383624] hover:bg-[#ff0000] hover:text-white ${brutalBtn}`}
        >
          이 캐릭터로 입장
        </button>
      </div>
    </div>
  );
}
