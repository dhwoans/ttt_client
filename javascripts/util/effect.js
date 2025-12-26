const manager = new Map();

export function effectOnce($element, effectName) {
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

export function effectrepeat($element, effectName) {
  //남아있는 다른 효과지움
  initEffect($element);
  manager.set($element, addRepeatEffect($element, effectName));
}

function addRepeatEffect($element, effectName) {
  const effectClass = `animate__${effectName}`;

  $element.classList.add("animate__animated", effectClass, "animate__infinite");

  //취소 함수 반환
  return () => {
    console.log("취소 실행");
    $element.classList.remove(
      "animate__animated",
      effectClass,
      "animate__infinite"
    );
  };
}
export function removeRepeat($element) {
  if (manager.has($element)) {
    manager.get($element)();
  }
}

function initEffect($element) {
  const allAnimateClasses = Array.from($element.classList).filter((c) =>
    c.startsWith("animate__")
  );
  $element.classList.remove(...allAnimateClasses);
}
