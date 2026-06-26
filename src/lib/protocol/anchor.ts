export type AnchorNetworkMode = "disabled" | "sepolia" | "mainnet-anchor-only";

export interface AnchorPayload {
  receiptHash: string;
  projectHash: string;
  evidenceDocketHash: string;
  decisionHash: string;
  metadataHash: string;
  metadataURI: string;
}

export interface AnchorRecord extends AnchorPayload {
  schema: "goalos.signoff.anchor.v1";
  chainId: number;
  contractAddress: string;
  transactionHash: string;
  blockNumber?: number;
  anchoredAt: string;
  explorerUrl: string;
}

const BYTES32 = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

export function assertBytes32(label: string, value: string): string {
  if (!BYTES32.test(value)) throw new Error(`${label} must be a 0x-prefixed 32-byte hash`);
  return value.toLowerCase();
}

export function assertAddress(label: string, value: string): string {
  if (!ADDRESS.test(value)) throw new Error(`${label} must be a 0x-prefixed Ethereum address`);
  return value;
}

export function normalizeAnchorPayload(payload: AnchorPayload): AnchorPayload {
  return {
    receiptHash: assertBytes32("receiptHash", payload.receiptHash),
    projectHash: assertBytes32("projectHash", payload.projectHash),
    evidenceDocketHash: assertBytes32("evidenceDocketHash", payload.evidenceDocketHash),
    decisionHash: assertBytes32("decisionHash", payload.decisionHash),
    metadataHash: assertBytes32("metadataHash", payload.metadataHash),
    metadataURI: String(payload.metadataURI || "")
  };
}

export function explorerBase(chainId: number): string {
  if (chainId === 1) return "https://etherscan.io";
  if (chainId === 11155111) return "https://sepolia.etherscan.io";
  return "";
}

export function makeAnchorRecord(input: AnchorPayload & {chainId:number; contractAddress:string; transactionHash:string; blockNumber?:number; anchoredAt?:string}): AnchorRecord {
  const payload = normalizeAnchorPayload(input);
  const contractAddress = assertAddress("contractAddress", input.contractAddress);
  const transactionHash = assertBytes32("transactionHash", input.transactionHash);
  const base = explorerBase(input.chainId);
  return {
    schema: "goalos.signoff.anchor.v1",
    ...payload,
    chainId: input.chainId,
    contractAddress,
    transactionHash,
    blockNumber: input.blockNumber,
    anchoredAt: input.anchoredAt || new Date().toISOString(),
    explorerUrl: base ? `${base}/tx/${transactionHash}` : ""
  };
}

export function anchoringModeFromEnv(value: string | undefined): AnchorNetworkMode {
  if (value === "sepolia" || value === "mainnet-anchor-only") return value;
  return "disabled";
}

export function canUseMainnetAnchoring(env: Record<string, string | undefined>): boolean {
  return env.GOALOS_MAINNET_ANCHORING_ENABLED === "true" && env.NEXT_PUBLIC_GOALOS_WEB3_MODE === "mainnet-anchor-only";
}
