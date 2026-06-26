import { describe, expect, it } from "vitest";
import { sha256Hex, stableStringify } from "./crypto";

describe("canonical utilities", () => {
  it("sorts object keys deterministically without changing array order", () => {
    expect(stableStringify({ z: 1, a: { y: 2, b: 3 }, list: [{ q: 1, a: 2 }, 4] }))
      .toBe('{"a":{"b":3,"y":2},"list":[{"a":2,"q":1},4],"z":1}');
  });
  it("produces the known SHA-256 digest", () => {
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});
