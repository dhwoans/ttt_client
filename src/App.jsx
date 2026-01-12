import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import LobbyApp from "./features/lobby/App";
import GameApp from "./features/game/App";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/lobby" element={<LobbyApp />} />
      <Route path="/game/:roomId?" element={<GameApp />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
