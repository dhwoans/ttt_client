import GameManager from "./GameManager";
import Player from "./components/Player";
import Chat from "./components/Chat";

export default function GamePage({ sender, players = [] }) {
  return (
    <div className="grid grid-cols-[300px_1fr_350px] gap-4 h-screen p-4 bg-linear-to-b from-gray-100 to-gray-200">
      <aside
        id="players-container"
        className="flex flex-col gap-4 overflow-y-auto"
      >
        {players.map((player) => (
          <Player
            key={player.userId}
            userId={player.userId}
            nickname={player.nickname}
            isReady={player.isReady}
          />
        ))}
      </aside>

      <section id="game-container" className="flex items-center justify-center">
        <GameManager sender={sender} />
      </section>

      <section id="chat-container" className="flex flex-col">
        <Chat sender={sender} />
      </section>
    </div>
  );
}
