import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthGuard() {
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");
  const nickname = sessionStorage.getItem("nickname");

  if (!userId || !nickname) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
