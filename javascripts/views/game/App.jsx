import { useGameSocket, createSocketSender } from "./useGameSocket";
import GamePage from "./GamePage";

export default function App() {
  const { sendMessage } = useGameSocket();
  const sender = createSocketSender(sendMessage);

  return <GamePage sender={sender} />;
}
