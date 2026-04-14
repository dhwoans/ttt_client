import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

// 로그인안한 계정이 컨텐츠 진입하는걸 막음.
export default function AuthGuard() {
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");
  const nickname = sessionStorage.getItem("nickname");

  if (!userId || !nickname) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
