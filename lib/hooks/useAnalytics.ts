"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("meenarh_session_id");
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem("meenarh_session_id", sid);
  }
  return sid;
}

async function trackPageView(url: string, sessionId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    await fetch(`${baseUrl}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "page_view",
        page_url: url,
        session_id: sessionId,
      }),
      keepalive: true,
    });
  } catch {
    // Silently fail -- analytics should never block the user
  }
}

export function useAnalytics() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (pathname && pathname !== lastTracked.current) {
      lastTracked.current = pathname;
      const sessionId = getSessionId();
      trackPageView(pathname, sessionId);
    }
  }, [pathname]);
}
