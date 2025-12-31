import { createRoot } from "react-dom/client";
import CharacterBoard from "./CharactorBoard";
import "/css/global.css";

const characterBoard = document.getElementById("island-character-board");
if (characterBoard) {
  createRoot(characterBoard).render(<CharacterBoard />);
}
