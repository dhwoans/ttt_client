import { useState, useEffect, ReactNode } from "react";
import { animalList } from "../constants/randomAvatar";
import { botList } from "../constants/randomBot";
interface AvatarProps {
  size?: "small" | "large";
  onClick?: () => void;
  children?: ReactNode;
  imageSrc?: string;
  effectOnce?: boolean;
}

export function Avatar({
  size,
  onClick,
  children,
  imageSrc,
  effectOnce,
}: AvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const hasOnClick = Boolean(onClick);
  const random: string = "❓";
  let wl: string;
  if (size === "small") {
    wl = "h-15 w-15 text-3xl";
  } else {
    wl = "h-50 w-50 text-8xl";
  }

  useEffect(() => {
    if (effectOnce && !hasAnimated) {
      setIsRandomizing(true);
      let count = 0;
      const interval = setInterval(() => {
        setRandomIndex(Math.floor(Math.random() * animalList.length));
        count++;
        if (count > 5) {
          clearInterval(interval);
          setIsRandomizing(false);
          setHasAnimated(true);
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [effectOnce, hasAnimated]);

  return (
    <>
      <div
        className={`grid place-items-center ${wl} rounded-full bg-white overflow-hidden ${hasOnClick ? "hover:cursor-pointer" : ""}`}
        onMouseEnter={() => hasOnClick && setIsHovered(true)}
        onMouseLeave={() => hasOnClick && setIsHovered(false)}
        onClick={onClick}
        role={hasOnClick ? "button" : undefined}
        tabIndex={hasOnClick ? 0 : undefined}
      >
        {isRandomizing ? (
          (() => {
            const randomSrc =
              randomIndex > 5
                ? animalList[randomIndex][2]
                : botList[randomIndex][2];

            return (
              <video
                className="w-30 h-30 object-cover"
                src={randomSrc}
                autoPlay
                loop
                muted
                playsInline
              />
            );
          })()
        ) : imageSrc ? (
          <video
            src={imageSrc}
            autoPlay
            loop
            muted
            playsInline
            className={`w-40 h-40 object-cover ${isHovered && hasOnClick ? "opacity-50" : ""}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center text-center ${
              isHovered && hasOnClick ? "opacity-50" : ""
            }`}
          >
            {isHovered && hasOnClick ? random : children}
          </div>
        )}
      </div>
    </>
  );
}
