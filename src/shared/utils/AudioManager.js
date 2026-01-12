import { eventManager } from "./EventManager.js";
import BGM from "/assets/sound/BGM.mp3";
import BEEP from "/assets/sound/beep.mp3";

class AudioManager {
  constructor() {
    this.audios = new Map();
    this.soundAssets = {
      bgm: BGM,
      beep: BEEP,
    };
    this.init();
  }

  init() {
    this.#addAudio("bgm", this.soundAssets.bgm, {
      loop: true,
      volume: 0.1,
      autoplay: true,
    });
    this.#addAudio("beep", this.soundAssets.beep, { volume: 0.5 });
  }

  #addAudio(id, src, options = {}) {
    const audio = new Audio(src);
    audio.loop = options.loop ?? false;
    audio.volume = options.volume ?? 0.1;
    this.audios.set(id, audio);

    if (options.autoplay) {
      audio.play().catch((error) => {
        console.error(`[${id}] 재생 실패:`, error);
      });
    }
    console.log(`[${id}] 음향 추가됨`);
  }

  setVolume(id, value) {
    const audio = this.audios.get(id);
    if (audio) {
      audio.volume = value;
    }
  }

  setOff(id) {
    const audio = this.audios.get(id);
    if (audio) {
      audio.pause();
    }
  }

  setOn(id) {
    const audio = this.audios.get(id);
    if (audio) {
      audio.play().catch((error) => {
        console.error(`[${id}] 재생 실패:`, error);
      });
    }
  }
}

export const audioManager = new AudioManager();
