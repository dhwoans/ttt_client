import { useEffect } from "react";

// 감지된 뒤로가기에 반응하여 종료 모달을 띄우는 공용 훅
export function useBackExitModal(
  onExitRequest: () => void,
  isActive: boolean = true,
) {
  useEffect(() => {
    if (!isActive) return;

    const currentUrl = window.location.href;
    // 히스토리에 더미 state를 쌓아 뒤로가기를 가로챔
    window.history.pushState(null, "", currentUrl);

    const handlePopState = () => {
      onExitRequest();
      // 모달을 띄운 뒤에도 추가 뒤로가기를 막기 위해 다시 푸시
      window.history.pushState(null, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onExitRequest, isActive]);
}
