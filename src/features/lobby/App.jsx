import { useEffect } from "react";
import { audioManager } from "../../shared/utils/AudioManager";
import LobbyPage from "./components/LobbyPage";
import Nav from "./components/Nav";

export default function App() {
  useEffect(() => {
    audioManager.setOn("BGM");
  }, []);

  return (
    <>
      <Nav></Nav>
      <LobbyPage></LobbyPage>);
    </>
  );
}
