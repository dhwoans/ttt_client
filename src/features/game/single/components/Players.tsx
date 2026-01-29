import "animate.css";
import { Avatar } from "@/shared/components/Avatar";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

interface PlayersProps {
  playerInfos: GamePlayerInfo[];
  isTurn?: string;
}

//턴 알림
export default function Players({ playerInfos, isTurn = "" }: PlayersProps) {
  return (
    <ol className="flex flex-row md:flex-col gap-10 md:gap-6">
      {playerInfos.map((player, index) => {
        const animClass =
          player.nickname === isTurn
            ? "animate__animated animate__bounce animate__infinite"
            : "";

        return (
          <li
            key={index}
            className={`flex flex-col items-center gap-1 ${animClass}`}
          >
            <Avatar size="small">{player.avatar}</Avatar>
            <p className="text-sm font-semibold text-white">
              {player.nickname}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
