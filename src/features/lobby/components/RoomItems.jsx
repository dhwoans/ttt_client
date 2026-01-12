export default function RoomItems({ item }) {
  const isfull = item.currentPlayers >= item.maxPlayers;

  const handleClick = () => {
    if (item.currentPlayers < item.maxPlayers) {
      sessionStorage.setItem("roomId", item.roomId);
      if (window.lobbyWebsocket) {
        window.lobbyWebsocket.disconnect();
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
        className={`w-full px-6 py-4 rounded-xl bg-white text-black font-bold text-left flex justify-between items-center ${brutalBtn} ${
          isfull ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <h3 className="text-xl font-black">
          {isfull ? "인원 초과" : "방 있음"}
        </h3>
        <small className="text-lg text-gray-600">
          {item.currentPlayers} / {item.maxPlayers}
        </small>
      </button>
    </li>
  );
}
