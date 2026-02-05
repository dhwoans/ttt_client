import { Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./features/auth/App";
import LobbyPage from "./pages/LobbyPage";
import GameApp from "./features/game/App";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthApp />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game/:roomId?" element={<GameApp />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
