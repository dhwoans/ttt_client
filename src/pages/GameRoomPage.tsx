import { useRoomState } from "../features/game/hooks/useRoomState";
import SingleGameRoomPage from "./SingleGameRoomPage";
import MultiGameRoomPage from "./MultiGameRoomPage";

export default function GameRoomPage() {
  const { mode } = useRoomState();

  switch (mode) {
    case "single":
      return <SingleGameRoomPage />;
    case "multi":
      return <MultiGameRoomPage />;
    default:
      // Local mode can be added here without changing single/multi pages.
      return <SingleGameRoomPage />;
  }
}
