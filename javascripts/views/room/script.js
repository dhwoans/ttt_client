import WebComponentWrapper from "../../util/WebComponentWrapper.js";
import EmptyLobbyMessage from "./components/EmptyLobbyMessage.js";
import RoomList from "./components/RoomList.js";
import RoomItems from "./components/RoomItems.js";
import Lobby from "./Lobby.js";
import AudioManager from "./AudioManager.js";
import BGM from "/assets/BGM.mp3";

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
const audioManager = new AudioManager(BGM);
window.lobbyWebsocket = websocket;

/* ========================================================= */
/* 커스텀 태그 등록 */
/* ========================================================= */

// Register as a web component: <empty-message message="..." repeat="3" src="..."></empty-message>
WebComponentWrapper.register("empty-message", EmptyLobbyMessage, {
  observedAttributes: ["message", "repeat", "src"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/components/empty-message.css",
});

WebComponentWrapper.register("room-list", RoomList, {
  observedAttributes: ["list"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/components/room-list.css",
});

WebComponentWrapper.register("room-item", RoomItems, {
  observedAttributes: ["item"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/components/room-list.css",
});
