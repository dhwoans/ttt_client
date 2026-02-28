import { useState } from "react";

export function useShakeAnimation() {
  const [isShaking, setIsShaking] = useState(false);

  const trigger = () => {
    setIsShaking(true);
  };

  const handleAnimationEnd = () => {
    setIsShaking(false);
  };

  return {
    isShaking,
    trigger,
    handleAnimationEnd,
  };
}
