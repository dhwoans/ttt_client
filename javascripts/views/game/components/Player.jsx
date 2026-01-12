import { useState, useEffect } from "react";
import { animalList } from "../../../util/randomAvatar.js";

export default function Player({
  userId,
  nickname,
  isReady,
  isLeaving = false,
}) {
  const [animationClass, setAnimationClass] = useState(
    "animate__animated animate__backInLeft"
  );

  useEffect(() => {
    if (isLeaving) {
      setAnimationClass("animate__animated animate__backOutLeft");
    }
  }, [isLeaving]);

  const isCurrentUser = sessionStorage.getItem("userId") === userId;
  const displayName = isCurrentUser ? "나" : nickname;

  return (
    <li
      data-user-id={userId}
      className={`flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${animationClass} ${
        isReady ? "animate__animated animate__bounce animate__infinite" : ""
      }`}
    >
      <span className="text-5xl">{animalList[0][0]}</span>
      <small className="text-sm font-bold text-gray-800">{displayName}</small>
    </li>
  );
}
