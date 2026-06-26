import { appUrl } from "@/lib/env";

export class RequestSecurityError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.name = "RequestSecurityError";
    this.status = status;
  }
}

export function assertSafeMutation(request: Request, maxBytes = 256 * 1024) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  const configuredOrigin = new URL(appUrl()).origin;
  if (!origin || (origin !== requestOrigin && origin !== configuredOrigin)) {
    throw new RequestSecurityError("This request came from an untrusted origin.", 403);
  }
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new RequestSecurityError("This endpoint accepts JSON requests only.", 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestSecurityError("The request is too large.", 413);
  }
}
