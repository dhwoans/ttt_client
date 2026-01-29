import GameManager from "./GameManager";
import Player from "./components/Players";
import Board from "../shared/components/Board";

export default function GamePage({ sender, players = [] }) {
  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className="
      min-h-screen
      mx-auto p-4
      max-w-5xl
      rounded-2xl 
      bg-linear-to-b from-dark-1 to-dark-2 
      md:my-4
      flex flex-col
      ${brutalBox}
    "
    >
      {/* 헤더 */}
      <h1 className="text-2xl md:text-3xl font-bold text-accent mb-4 md:mb-6 text-center drop-shadow-md">
        GAME ROOM
      </h1>

      {/* 콘텐츠 */}
      <div
        className="
        grid grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] 
        gap-3 md:gap-4 
        flex-1 
        overflow-hidden
      "
      >
        {/* 플레이어 목록 */}
        <aside
          className="
          flex flex-col gap-2 md:gap-4 overflow-y-auto
          rounded-lg md:rounded-xl 
          bg-dark-1/50 
          p-2 md:p-4
          ${brutalBox}
        "
        >
          <h2 className="font-bold text-sm md:text-lg text-accent">플레이어</h2>
          {players.map((player) => (
            <Player
              key={player.userId}
              userId={player.userId}
              nickname={player.nickname}
              isReady={player.isReady}
            />
          ))}
        </aside>

        {/* 게임 영역 */}
        <section
          className="
          flex items-center justify-center
          rounded-lg md:rounded-xl 
          bg-dark-1/50
          ${brutalBox}
        "
        >
          <GameManager sender={sender} />
        </section>
      </div>
    </div>
  );
}
