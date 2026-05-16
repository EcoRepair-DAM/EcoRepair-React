import { apiRequest } from "./apiClient";
import type { AppRole, AuthUser } from "../types/auth";

export function getUsers() {
  return apiRequest<AuthUser[]>("/users");
}

export function updateUserRole(id: number, role: AppRole) {
  return apiRequest<AuthUser>(`/users/${id}/role`, {
    method: "PUT",
    body: { role },
  });
}

export function deleteUser(id: number) {
  return apiRequest<void>(`/users/${id}`, {
    method: "DELETE",
  });
}