import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { AppRole } from "../types/auth";
import { useAuth } from "./authContext";

export default function RequireRole({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: AppRole[];
}) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}