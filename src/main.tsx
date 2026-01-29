import "animate.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// 개발 환경에서만 MSW 초기화
if (process.env.NODE_ENV === "development") {
  const { worker } = await import("./mock/browser");
  await worker.start({
    onUnhandledRequest: "bypass", // 모킹되지 않은 요청은 실제 서버로 전송
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
