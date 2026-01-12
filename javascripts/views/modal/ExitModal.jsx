import { useEffect } from "react";

export default function ExitModal({ sender, onClose }) {
  useEffect(() => {
    // 히스토리 트랩 설정
    history.pushState(null, "", location.href);

    const handlePopState = () => {
      history.pushState(null, "", location.href);
      // 모달이 이미 열려있으면 무시
      if (document.querySelector("dialog.exit")) {
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleStay = () => {
    if (onClose) onClose();
  };

  const handleLeave = () => {
    sender.handleLeave();
    window.sessionStorage.removeItem("roomId");
    window.location.href = "/";
  };

  const brutalBox =
    "border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";
  const brutalBtn = `${brutalBox} hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all active:scale-95`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
      <dialog
        open
        className="exit bg-white rounded-2xl p-8 max-w-md w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate__animated animate__bounceIn"
      >
        <h3 className="text-2xl font-black text-center mb-6 text-gray-800">
          게임에서 나가시겠습니까?
        </h3>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStay}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-gray-300 hover:bg-gray-400 ${brutalBtn}`}
          >
            머무르기
          </button>
          <button
            onClick={handleLeave}
            className={`px-8 py-3 rounded-xl text-lg font-bold bg-red-500 hover:bg-red-600 text-white ${brutalBtn}`}
          >
            나가기
          </button>
        </div>
      </dialog>
    </div>
  );
}
