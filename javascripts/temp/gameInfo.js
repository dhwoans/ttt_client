// 로그인, 대기실구현이 없어서 임시 파일로 대체
let roomId = "123";
let userId = sessionStorage.getItem("userId") || "temp";
let nickname = userId.toString().slice(0, 4);
let symbol = null;

export function setRoomId(id) {
  roomId = id;
}

export function setUserId(id) {
  UserId = id;
}
export function setSymbol(mark) {
  symbol = mark;
}
export function getSymbol() {
  return symbol;
}
export function getRoomId() {
  return roomId;
}

export function getUserId() {
  return userId;
}
export function setUserNickname(name) {
  nickname = name;
}
export function getUserNickname() {
  return nickname;
}

export function clearGameState() {
  currentRoomId = null;
  currentUserId = null;
}

