import Lobby from "./Lobby.js";

import LobbySocket from "./LobbySocket.js";

function initializeSessionId() {
  let userId = sessionStorage.getItem("userId");

  if (!userId) {
    userId = crypto.randomUUID();
    sessionStorage.setItem("userId", userId);
    console.log("새로운 세션 ID가 생성되었습니다:", userId);
  } else {
    sessionStorage.setItem("userId", userId);
    console.log("기존 세션 ID가 재사용되었습니다:", userId);
  }

  return userId;
}

initializeSessionId();
sessionStorage.removeItem("PLAYING");
console.log(sessionStorage.getItem("userId"));
const lobby = new Lobby();
const websocket = new LobbySocket(lobby);
window.lobbyWebsocket = websocket;
