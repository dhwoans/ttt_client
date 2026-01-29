import { motion } from "motion/react";
import { useGameSocket, createSocketSender } from "../hooks/useGameSocket";
import GamePage from "./GamePage";
import Chat from "./components/Chat";

export default function App() {
  const { sendMessage } = useGameSocket();
  const sender = createSocketSender(sendMessage);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        }}
      >
        <GamePage sender={sender} />
      </motion.div>
      {/* Chat은 애니메이션 적용 안함 */}
      <Chat sender={sender} />
    </>
  );
}
