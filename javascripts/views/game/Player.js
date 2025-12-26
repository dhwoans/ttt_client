import { getRandomAnimalEmoji } from "../../temp/randomAvatar.js";
import { effectOnce, effectrepeat, removeRepeat } from "../../temp/effect.js";
class Player {
  constructor(sender) {
    this.sender = sender;
    this.element = document.getElementById("players");
    this.user = new Set(); // 중복 렌더링 검사
  }

  rendering(userId, nickname, isReady) {
    this.user.add(userId);
    const $player = document.createElement("li");
    const $avatar = document.createElement("span");
    const $nickname = document.createElement("small");
    //왼쪽에서 나오는 효과
    effectOnce($player, "backInLeft");

    $player.dataset.userId = userId;
    $player.classList.add("player");
    $avatar.textContent = getRandomAnimalEmoji();
    $nickname.textContent =
      sessionStorage.getItem("userId") === userId ? "나" : nickname;
    $player.appendChild($avatar);
    $player.appendChild($nickname);

    this.element.appendChild($player);
    this.highlight(userId, isReady);
  }
  hasUser(userId) {
    return this.user.has(userId);
  }

  leavePlayer(userId) {
    const child = document.querySelector(`.player[data-user-id="${userId}"]`);
    if (child) {
      effectOnce(child, "backOutLeft");
      setTimeout(() => {
        this.element.removeChild(child);
      }, 500);
    }
    this.user.delete(userId);
  }
  highlight(userId, status) {
    const child = document.querySelector(`.player[data-user-id="${userId}"]`);
    if (child) {
      if (status) {
        effectrepeat(child, "bounce");
      } else {
        removeRepeat(child);
      }
    }
  }
  removeAllhighlight() {
    const children = document.querySelectorAll(".player");
    for (let child of children) {
      removeRepeat(child);
    }
  }
}

export default Player;
