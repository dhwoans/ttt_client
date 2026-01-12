import { createRoot } from "react-dom/client";
import CharacterBoard from "./components/CharactorBoard";

const characterBoard = document.querySelector("body");
if (characterBoard) {
  createRoot(characterBoard).render(<CharacterBoard />);
}
