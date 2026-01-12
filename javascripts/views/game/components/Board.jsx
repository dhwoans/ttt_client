import { useEffect, useRef } from "react";
import { eventManager } from "../../../util/EventManager.js";

export default function Board({ list = [] }) {
  const boardRef = useRef(null);

  useEffect(() => {
    const handleMove = (data) => {
      handleBoardUpdate(data);
      offBtn(true);
    };

    eventManager.on("MOVE", handleMove);

    return () => {
      eventManager.off("MOVE", handleMove);
    };
  }, []);

  const handleCell = (x, y) => {
    eventManager.emit("CELL_CLICK", { x, y });
  };

  const handleBoardUpdate = (data) => {
    eventManager.emit("BOARD_UPDATE", data);
  };

  const offBtn = (flag) => {
    if (!boardRef.current) return;
    const buttons = boardRef.current.querySelectorAll("button");
    buttons.forEach((btn) => {
      if (btn.textContent === "") btn.disabled = flag;
    });
  };

  return (
    <ol ref={boardRef} className="grid grid-cols-3 gap-2 p-4">
      {[0, 1, 2].map((x) => (
        <li key={x} className="flex flex-col">
          <ol className="grid grid-cols-1 gap-2">
            {[0, 1, 2].map((y) => (
              <li key={y} data-raw={x} data-col={y}>
                <button
                  onClick={() => handleCell(x, y)}
                  className="w-20 h-20 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-2xl font-bold disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-95"
                >
                  {/* Symbol will be filled here */}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
