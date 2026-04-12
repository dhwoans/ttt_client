import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

export default function AuthGuard() {
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");
  const nickname = sessionStorage.getItem("nickname");

  if (!userId || !nickname) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
