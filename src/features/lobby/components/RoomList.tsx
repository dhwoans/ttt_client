import EmptyLobby from "./EmptyLobby.jsx";
import RoomItems from "./RoomItems.jsx";

export default function RoomList({ list = [] }: { list?: any[] }) {
  // 데이터가 없을 때
  if (list.length === 0) {
    return <EmptyLobby message="방이 없습니다 방이 없어요" repeat={4} />;
  }

  // 데이터가 있을 때
  return (
    <ul className="list-none p-0 m-0 mb-6 grow overflow-y-auto flex flex-col gap-2">
      {list.map((item) => (
        <RoomItems key={item.roomId} item={item} />
      ))}
    </ul>
  );
}
