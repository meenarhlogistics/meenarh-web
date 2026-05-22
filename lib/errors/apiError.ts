import { isAxiosError } from "axios";
import { toast } from "sonner";

export type ApiErrorBody = {
  success?: boolean;
  message?: string;
  errors?: string[] | Record<string, string[]>;
  code?: string;
};

export type ParsedApiError = {
  message: string;
  items?: string[];
  code?: string;
  status?: number;
};

const GENERIC_MESSAGES = new Set(["validation failed", "invalid query"]);

function isGenericMessage(message: string | undefined): boolean {
  if (!message?.trim()) return true;
  return GENERIC_MESSAGES.has(message.trim().toLowerCase());
}

function normalizeErrors(errors: ApiErrorBody["errors"]): string[] {
  if (!errors) return [];
  if (Array.isArray(errors)) {
    return errors.map((e) => String(e).trim()).filter(Boolean);
  }
  return Object.values(errors)
    .flat()
    .map((e) => String(e).trim())
    .filter(Boolean);
}

function getAxiosBody(error: unknown): ApiErrorBody | undefined {
  if (!isAxiosError(error)) return undefined;
  const data = error.response?.data;
  if (data && typeof data === "object") {
    return data as ApiErrorBody;
  }
  return undefined;
}

function getHttpStatus(error: unknown): number | undefined {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

function statusFallback(status: number | undefined): string | null {
  if (status === undefined || status === 0) {
    return "Unable to reach the server. Check your connection and try again.";
  }
  switch (status) {
    case 401:
      return "Session expired. Please sign in again.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    default:
      return null;
  }
}

export function getApiError(error: unknown, fallback: string): ParsedApiError {
  const body = getAxiosBody(error);
  const status = getHttpStatus(error);
  const errorItems = normalizeErrors(body?.errors);
  const bodyMessage = body?.message?.trim();

  let message = fallback;
  let items: string[] | undefined;

  if (errorItems.length > 0 && isGenericMessage(bodyMessage)) {
    message = errorItems[0];
    if (errorItems.length > 1) {
      items = errorItems;
    }
  } else if (bodyMessage && !isGenericMessage(bodyMessage)) {
    message = bodyMessage;
    if (errorItems.length > 1) {
      items = errorItems;
    }
  } else if (errorItems.length > 0) {
    message = errorItems.length === 1 ? errorItems[0] : errorItems.join(". ");
    if (errorItems.length > 1) {
      items = errorItems;
    }
  } else if (bodyMessage) {
    message = bodyMessage;
  }

  const hasSpecificBackendMessage = Boolean(
    bodyMessage && !isGenericMessage(bodyMessage)
  );
  const statusMsg = statusFallback(status);
  // Never replace a concrete API message with a status default (e.g. login 401
  // returns "Invalid email or password" which must not become "Session expired").
  if (
    statusMsg &&
    !hasSpecificBackendMessage &&
    (message === fallback || isGenericMessage(message))
  ) {
    message = statusMsg;
  } else if (hasSpecificBackendMessage) {
    message = bodyMessage!;
  }

  if (!isAxiosError(error) && error instanceof Error && message === fallback && error.message) {
    message = error.message;
  }

  return {
    message,
    items,
    code: body?.code,
    status,
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return getApiError(error, fallback).message;
}

export function getApiErrorDetails(error: unknown, fallback: string): ParsedApiError {
  return getApiError(error, fallback);
}

export function showApiErrorToast(error: unknown, fallback: string): void {
  const { message, items } = getApiErrorDetails(error, fallback);
  if (items && items.length > 1) {
    toast.error(message, {
      description: items.slice(1, 3).join(" · "),
    });
  } else {
    toast.error(message);
  }
}
