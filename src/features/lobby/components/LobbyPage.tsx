import GameModeGrid from "./GameModeGrid";

export default function LobbyPage() {
  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";

  return (
    <div
      className={`
        mx-4 md:mx-auto md:my-4 
        max-w-6xl 
        rounded-2xl 
        bg-linear-to-b from-dark-1 to-dark-2 
        p-6 md:p-12 
        border-4 border-black 
        shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
        min-h-[70vh] 
        flex flex-col
        ${brutalBox}
      `}
    >
      {/* 헤더 */}
      <h2 className="mb-8 md:mb-12 text-center text-3xl md:text-4xl font-bold text-accent drop-shadow-md">
        게임 모드 선택
      </h2>

      {/* Bento Grid */}
      <GameModeGrid />
    </div>
  );
}
