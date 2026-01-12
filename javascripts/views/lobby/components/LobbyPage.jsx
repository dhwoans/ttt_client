import { useState } from "react";
import RoomList from "./RoomList.jsx";
import { apiManager } from "../../../util/ApiManager.js";

export default function LobbyPage() {
  const [list, setList] = useState([]);

  const handleCreateRoom = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login.html";
      return;
    }

    try {
      const result = await apiManager.createRoom(userId);
      if (result && result.success) {
        const roomId = result.message;
        sessionStorage.setItem("roomId", roomId);
        window.location.href = "/game.html";
      } else {
        alert(result?.message || "방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방 생성 오류:", error);
      alert("방 생성 중 오류가 발생했습니다.");
    }
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <div className="my-12 mx-10 rounded-2xl bg-linear-to-b from-dark-1 to-dark-2 p-8 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
      <RoomList list={list} />
      <div className="flex justify-center mt-6">
        <button
          id="makeRoom"
          onClick={handleCreateRoom}
          className={`px-8 py-3 rounded-xl text-lg font-bold bg-accent hover:bg-yellow-400 text-black ${brutalBtn}`}
        >
          방 만들기
        </button>
      </div>
    </div>
  );
}
