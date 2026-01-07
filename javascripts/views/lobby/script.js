import WebComponentWrapper from "../../util/WebComponentWrapper.js";
import EmptyLobby from "./components/EmptyLobby.js";
import RoomList from "./components/RoomList.js";
import RoomItems from "./components/RoomItems.js";
import { eventManager } from "../../util/EventManager.js";
import { audioManager } from "../../util/AudioManager.js";

window.addEventListener("load", () => {
  audioManager.setOn("bgm");
  // eventManager.emit("audio:play", "bgm");
});

/* ========================================================= */
/* 커스텀 태그 등록 */
/* ========================================================= */


WebComponentWrapper.register("empty-message", EmptyLobby, {
  observedAttributes: ["message", "repeat", "src"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/lobby/EmptyLobbyMessage.css",
});

WebComponentWrapper.register("room-list", RoomList, {
  observedAttributes: ["list"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/lobby/RoomList.css",
});

WebComponentWrapper.register("room-item", RoomItems, {
  observedAttributes: ["item"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/lobby/RoomItems.css",
});
