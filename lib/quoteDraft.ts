export const QUOTE_DRAFT_STORAGE_KEY = "meenarh_quote_draft";

export interface QuoteDraft {
  pickup_region_id?: number;
  delivery_region_id?: number;
  delivery_region_area_id?: number;
  pickup_address?: string;
  delivery_address?: string;
  sender_phone?: string;
  package_description?: string;
  delivery_type_label?: string;
  package_size?: string;
}

export function saveQuoteDraft(draft: QuoteDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(QUOTE_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readQuoteDraft(): QuoteDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(QUOTE_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuoteDraft;
  } catch {
    return null;
  }
}

export function clearQuoteDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(QUOTE_DRAFT_STORAGE_KEY);
}

export function buildPackageDescription(draft: QuoteDraft): string {
  const parts: string[] = [];
  if (draft.package_description?.trim()) {
    parts.push(draft.package_description.trim());
  }
  if (draft.package_size?.trim()) {
    parts.push(`Size: ${draft.package_size.trim()}`);
  }
  if (draft.delivery_type_label?.trim()) {
    parts.push(`Requested service: ${draft.delivery_type_label.trim()}`);
  }
  return parts.join("\n");
}
