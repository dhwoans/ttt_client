import { createRoot } from "react-dom/client";
import CharacterBoard from "./components/CharactorBoard";

const characterBoard = document.getElementById("character-board");
if (characterBoard) {
  createRoot(characterBoard).render(<CharacterBoard />);
}
