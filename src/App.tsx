import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./features/auth/App";
import LobbyApp from "./features/lobby/App";
import GameApp from "./features/game/single/App";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthApp />} />
      <Route path="/lobby" element={<LobbyApp />} />
      <Route path="/game/:roomId?" element={<GameApp />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
