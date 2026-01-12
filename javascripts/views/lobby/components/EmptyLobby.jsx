import empty_fric from "/assets/empty_fric.gif";

export default function EmptyLobby({
  img = empty_fric,
  message = "404",
  repeat = 1,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <img
        src={img}
        alt="Empty Lobby Image"
        className="w-64 h-64 object-contain animate__animated animate__fadeIn"
      />
      {Array.from({ length: repeat }).map((_, index) => (
        <h1
          key={index}
          className="text-6xl font-black text-gray-800 drop-shadow-lg animate__animated animate__bounceIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {message}
        </h1>
      ))}
    </div>
  );
}
