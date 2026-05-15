export type AppRole = "ADMIN" | "EDITOR" | "USER";

export interface AuthUser {
  id: number;
  email: string;
  role: AppRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: AppRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}