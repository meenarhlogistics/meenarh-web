import { safeRedirect } from "@/lib/auth/safeRedirect";

const STORAGE_KEY = "meenarh_post_auth_redirect";

export function setPostAuthRedirect(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, path);
}

export function getPostAuthRedirect(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearPostAuthRedirect(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function consumePostAuthRedirect(fallback = "/dashboard"): string {
  const path = getPostAuthRedirect();
  clearPostAuthRedirect();
  return safeRedirect(path) ?? fallback;
}
