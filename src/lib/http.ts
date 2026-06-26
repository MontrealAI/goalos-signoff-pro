import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestSecurityError } from "@/lib/security/request";

const privateHeaders = { "cache-control": "private, no-store", "x-content-type-options": "nosniff" };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status, headers: privateHeaders });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status, headers: privateHeaders });
}

function statusForMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("authentication required")) return 401;
  if (lower.includes("permission") || lower.startsWith("only the client") || lower.startsWith("sign in as")) return 403;
  if (lower.includes("not found") || lower.includes("unavailable")) return 404;
  if (lower.includes("expired")) return 410;
  if (lower.includes("already") || lower.includes("closed") || lower.includes("no longer open")) return 409;
  if (lower.includes("invalid") || lower.includes("missing") || lower.includes("does not belong") || lower.includes("not ready") || lower.includes("could not match")) return 422;
  return 500;
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) return fail("Please correct the highlighted information.", 422, error.flatten());
  if (error instanceof RequestSecurityError) return fail(error.message, error.status);
  const message = error instanceof Error ? error.message : "Unexpected error";
  const status = statusForMessage(message);
  console.error(error);
  const safeMessage = status < 500 || process.env.NODE_ENV !== "production" ? message : "The service could not complete this request. Please try again or contact support.";
  return fail(safeMessage, status);
}
