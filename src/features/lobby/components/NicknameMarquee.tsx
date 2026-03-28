import { useEffect, useState } from "react";

interface NicknameMarqueeProps {
  emoji?: string;
}

const NicknameMarquee = ({ emoji = "🎮" }: NicknameMarqueeProps) => {
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("nickname");
    if (stored) {
      setNickname(stored);
    }
  }, []);

  if (!nickname) return null;

  return (
    <div className="w-full h-8 bg-white border-y-4 border-black overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee-content {
          animation: marquee 60s linear infinite;
          white-space: nowrap;
          font-weight: bold;
          color: black;
          font-size: 1rem;
        }
      `}</style>
      <div className="marquee-content h-full flex items-center">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="flex items-center gap-1 mr-50">
            {emoji} {nickname}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NicknameMarquee;
