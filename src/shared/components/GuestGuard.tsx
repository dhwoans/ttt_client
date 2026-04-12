import { Navigate, Outlet } from "react-router-dom";
import { ROUTES, isAuthenticated } from "@/shared/constants/routes";

// 비로그인(guest) 전용 라우트를 보호한다.
// 이미 로그인된 사용자는 login 같은 guest 페이지 대신 lobby로 보낸다.
export default function GuestGuard() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.lobby} replace />;
  }

  // 비로그인 사용자는 자식 라우트(예: /login) 접근을 허용한다.
  return <Outlet />;
}
