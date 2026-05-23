export const DASHBOARD_TRACK_PATH = "/dashboard/track";

export function trackLoginUrl(trackingCode?: string): string {
  const trimmed = trackingCode?.trim();
  const next = trimmed
    ? `${DASHBOARD_TRACK_PATH}?tracking=${encodeURIComponent(trimmed)}`
    : DASHBOARD_TRACK_PATH;
  return `/login?next=${encodeURIComponent(next)}`;
}
