import { describe, expect, it } from "vitest";
import { assertSafeMutation, RequestSecurityError } from "./request";

describe("mutation request protection", () => {
  it("accepts a same-origin JSON mutation", () => {
    const request = new Request("https://signoff.example/api/projects", { method: "POST", headers: { origin: "https://signoff.example", "content-type": "application/json", "content-length": "2" }, body: "{}" });
    expect(() => assertSafeMutation(request)).not.toThrow();
  });
  it("rejects a cross-origin mutation", () => {
    const request = new Request("https://signoff.example/api/projects", { method: "POST", headers: { origin: "https://evil.example", "content-type": "application/json" }, body: "{}" });
    expect(() => assertSafeMutation(request)).toThrow(RequestSecurityError);
  });
});
