import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loadingSession } = useAuth();
  const location = useLocation();

  if (loadingSession) {
    return <p className="status-text">Loading session...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}