import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix))
    ?.slice(prefix.length) ?? null;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  const unsafe = ["post", "put", "patch", "delete"].includes(method);
  if (unsafe) {
    const csrf = getCookie("csrf_token");
    if (csrf) {
      config.headers["X-CSRF-Token"] = decodeURIComponent(csrf);
    }
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Auto-redirect on 401 ONLY when the user is already inside a protected
    // area (the dashboard). On marketing / public pages, a 401 from an auth
    // probe (e.g. GET /user/me used by loadAuth) is expected for guests and
    // must be surfaced to the caller — not turned into a forced redirect.
    // The dashboard layout has its own auth guard that handles unauthenticated
    // users gracefully.
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isProtectedArea = path.startsWith("/dashboard");
      if (isProtectedArea && path !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
