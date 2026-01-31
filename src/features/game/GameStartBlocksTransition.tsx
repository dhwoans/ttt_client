import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const BLOCKS = 6;
const BLOCK_COLOR = "#111";

export default function GameStartBlocksTransition() {
  const blockRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [render, setRender] = useState(false);

  useLayoutEffect(() => {
    setRender(true);
    blockRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { top: 0, height: 0 });
      }
    });
    if (textRef.current)
      gsap.set(textRef.current, { opacity: 0, scale: 0.7 });

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        setRender(false);
      },
    });
    tl.to(blockRefs.current, {
      duration: 0.4,
      height: "100%",
      top: (i: number) => `${i * (100 / BLOCKS)}%`,
      delay: 0.2,
      stagger: 0.05,
    });
    tl.to(
      textRef.current,
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "+=0.1",
    );
    tl.to(
      textRef.current,
      { opacity: 0, scale: 0.7, duration: 0.4, ease: "power1.in" },
      "+=0.7",
    );
    tl.to(
      blockRefs.current.slice().reverse(),
      {
        duration: 0.4,
        height: 0,
        top: 0,
        delay: 0.2,
        stagger: 0.05,
      },
      "+=0.1",
    );
    tl.set(blockRefs.current, { top: 0, height: 0 });
  }, []);

  if (!render) return null;

  return (
    <div
      className="fixed left-0 top-0 w-full h-full min-h-screen z-50 flex items-center justify-center pointer-events-none transition-container from-top"
      style={{
        background: "transparent",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {Array.from({ length: BLOCKS }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            blockRefs.current[i] = el;
          }}
          className="tile"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            margin: "0 auto",
            background: BLOCK_COLOR,
            width: "100%",
            height: 0,
            top: 0,
            borderRadius: "0.5rem",
            zIndex: 10 + i,
            transition: "none",
            pointerEvents: "none",
          }}
        />
      ))}
      <span
        ref={textRef}
        className="absolute left-0 right-0 mx-auto text-center text-white text-6xl font-extrabold drop-shadow-lg tracking-widest select-none"
        style={{ top: "40vh", zIndex: 99 }}
      >
        GAME START
      </span>
    </div>
  );
}
