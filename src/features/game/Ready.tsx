import { useNavigate } from "react-router-dom";
import { VersusBanner } from "@/features/game/VersusBanner";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

interface SingleReadyProps {
  onReady: () => void;
  playersInfos: GamePlayerInfo[];
}

export default function Ready({ onReady, playersInfos }: SingleReadyProps) {
  const navigate = useNavigate();

  const brutalBox =
    "border-[0.25rem] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <VersusBanner playersInfos={playersInfos} />

      <div className="flex flex-col gap-4">
        <button
          onClick={onReady}
          className={`px-10 py-4 rounded-2xl text-2xl font-black bg-accent text-dark-1 ${brutalBtn}`}
        >
          준비
        </button>
        <button
          onClick={() => navigate("/lobby")}
          className={`px-10 py-4 rounded-2xl text-2xl font-black bg-white text-dark-1 ${brutalBtn}`}
        >
          나가기
        </button>
      </div>
    </section>
  );
}
