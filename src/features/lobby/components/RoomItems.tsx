interface RoomItem {
  roomId: string;
  currentPlayers: number;
  maxPlayers: number;
  [key: string]: any;
}

export default function RoomItems({ item }: { item: RoomItem }) {
  const isfull = item.currentPlayers >= item.maxPlayers;

  const handleClick = () => {
    if (item.currentPlayers < item.maxPlayers) {
      sessionStorage.setItem("roomId", item.roomId);
      const ws = (window as any).lobbyWebsocket;
      if (ws) {
        ws.disconnect();
      }
      window.location.href = `/game.html`;
    }
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <li className={`room-item ${isfull ? "opacity-60" : ""}`}>
      <button
        onClick={handleClick}
        disabled={isfull}
        className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl bg-white text-black font-bold text-left flex justify-between items-center ${brutalBtn} ${
          isfull ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <h3 className="text-base md:text-xl font-black">
          {isfull ? "인원 초과" : "방 있음"}
        </h3>
        <small className="text-sm md:text-lg text-gray-600">
          {item.currentPlayers} / {item.maxPlayers}
        </small>
      </button>
    </li>
  );
}
