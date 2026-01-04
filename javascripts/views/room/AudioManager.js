class AudioManager {
  constructor(src) {
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.1;
    this.init();
  }

  init() {
    window.addEventListener("load", () => {
      this.audio
        .play()
        .then(() => {
          console.log("BGM 재생 시작");
          // 재생에 성공하면 이벤트 리스너 제거
          window.removeEventListener("click", startAudio);
        })
        .catch((error) => {
          console.error("재생 실패 :", error);
        });
    }
);
  }

  // 볼륨 조절
  setVolume(value) {
    this.audio.volume = value;
  }
  // 끄기
  setOff() {
    this.audio.pause();
  }
  setOn() {
    this.audio.play();
  }
}

export default AudioManager;
