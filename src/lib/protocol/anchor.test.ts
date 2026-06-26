import { describe, expect, it } from "vitest";
import { makeAnchorRecord, anchoringModeFromEnv, canUseMainnetAnchoring } from "./anchor";

const h = "0x" + "11".repeat(32);
const h2 = "0x" + "22".repeat(32);
const h3 = "0x" + "33".repeat(32);
const h4 = "0x" + "44".repeat(32);
const h5 = "0x" + "55".repeat(32);

it("builds a normalized anchor record", () => {
  const rec = makeAnchorRecord({receiptHash:h,projectHash:h2,evidenceDocketHash:h3,decisionHash:h4,metadataHash:h5,metadataURI:"ipfs://bafy",chainId:11155111,contractAddress:"0x"+"aa".repeat(20),transactionHash:h});
  expect(rec.schema).toBe("goalos.signoff.anchor.v1");
  expect(rec.explorerUrl).toContain("sepolia.etherscan.io");
});

it("fails closed on bad hashes", () => {
  expect(() => makeAnchorRecord({receiptHash:"0x01",projectHash:h2,evidenceDocketHash:h3,decisionHash:h4,metadataHash:h5,metadataURI:"",chainId:1,contractAddress:"0x"+"aa".repeat(20),transactionHash:h})).toThrow();
});

it("defaults to disabled mode", () => {
  expect(anchoringModeFromEnv(undefined)).toBe("disabled");
  expect(anchoringModeFromEnv("mainnet-anchor-only")).toBe("mainnet-anchor-only");
  expect(canUseMainnetAnchoring({GOALOS_MAINNET_ANCHORING_ENABLED:"true", NEXT_PUBLIC_GOALOS_WEB3_MODE:"sepolia"})).toBe(false);
});
