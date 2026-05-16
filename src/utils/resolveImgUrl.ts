import { API_BASE_URL } from "../services/apiClient";

export function resolveImgUrl(url: string | null | undefined): string {
  if (!url) return "";

  const trimmedUrl = String(url).trim();
  if (!trimmedUrl) return "";

  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("/")) {
    return `${API_BASE_URL}${trimmedUrl}`;
  }

  return `${API_BASE_URL}/${trimmedUrl}`;
}
