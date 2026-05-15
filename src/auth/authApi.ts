import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "../types/auth";

const API_BASE_URL = "http://localhost:8080";
const TOKEN_STORAGE_KEY = "ecorepair_auth_token";

function extractToken(data: AuthResponse): string {
  if (!data.accessToken) {
    throw new Error("The API did not return a token.");
  }

  return data.accessToken;
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function parseError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data.message ?? data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function loginRequest(payload: LoginRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Invalid credentials."));
  }

  const data = (await response.json()) as AuthResponse;
  return extractToken(data);
}

export async function registerRequest(payload: RegisterRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "User could not be registered."));
  }

  const data = (await response.json()) as AuthResponse;
  return extractToken(data);
}

export async function meRequest(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid or expired token.");
  }

  return (await response.json()) as AuthUser;
}