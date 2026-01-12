import { eventManager } from "./EventManager";
class EffectManager {
  constructor() {
    this.manager = new Map();
    this.setupEventListeners();
  }
  setupEventListeners() {
    eventManager.on("effectOnece", ($element, effectName) =>
      this.effectOnce($element, effectName)
    );
    eventManager.on("effectRepeat", ($element, effectName) => {
      console.log("실행");
      this.effectRepeat($element, effectName);
    });
  }
  effectOnce() {
    //남아있는 다른 효과지움
    initEffect($element);
    const effect = `animate__${effectName}`;
    $element.classList.add("animate__animated", effect);

    //다른 효과 빨리 누르면 안지워짐
    $element.addEventListener(
      "animationend",
      (event) => {
        event.stopPropagation();
        $element.classList.remove("animate__animated", effect);
      },
      { once: true }
    );
  }

  effectRepeat() {
    //남아있는 다른 효과지움
    initEffect($element);
    manager.set($element, addRepeatEffect($element, effectName));
  }

  addRepeatEffect($element, effectName) {
    const effectClass = `animate__${effectName}`;

    $element.classList.add(
      "animate__animated",
      effectClass,
      "animate__infinite"
    );

    //취소 함수 반환
    return () => {
      console.log(this.constructor.name, ": 취소 실행");
      $element.classList.remove(
        "animate__animated",
        effectClass,
        "animate__infinite"
      );
    };
  }

  initEffect() {
    const allAnimateClasses = Array.from($element.classList).filter((c) =>
      c.startsWith("animate__")
    );
    $element.classList.remove(...allAnimateClasses);
  }
}

export const effectManger = new EffectManager();
