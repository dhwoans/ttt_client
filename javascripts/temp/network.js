import { getUserNickname, getUserId } from "./gameInfo.js";

/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */
export const createRoom = async (userId) => {
  try {
    const response = await fetch("/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        nickname: getUserNickname(),
      }),
    });
    const data = await response.json();
    if (data.success) {
      sessionStorage.setItem("roomId", data.message);
      window.lobbyWebsocket.disconnect();
      window.location.href = `/room/${data.message}`;
    } else {
      alert("방 생성에 실패했습니다.");
    }
    return data;
  } catch (error) {
    console.error("방 생성 요청 중 에러:", error);
  }
};
export const checkRoom = async (roomId) => {
  try {
    const response = await fetch(`/api/room?roomId=${roomId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!data.success) {
      window.location.location.reload();
    }
    return data;
  } catch (error) {
    console.error("방 확인 중 에러:", error);
  }
};

export const getRoomList = async () => {
  try {
    const response = await fetch("/api/roomList", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      console.log(data.roomList);
      return data.roomList;
    }
  } catch (error) {
    console.error("방 불러오기 실패", error);
  }
};
