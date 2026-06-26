# Web3 verification guide

## What on-chain anchoring proves

It proves that a specific receipt hash and evidence root were recorded by the GoalOS anchor contract at a specific chain time.

## What it does not prove

It does not prove every factual claim is true. It does not provide escrow. It does not authorize user funds. It does not mean the reviewer was economically bonded unless a future bonded-review module is explicitly enabled.

## First safe setup

1. Deploy `GoalOSSignoffAnchorV1` to Sepolia.
2. Keep `agialphaFeeAmount` at zero.
3. Set one dedicated operator wallet.
4. Fund that wallet only with testnet ETH.
5. Set `GOALOS_BLOCKCHAIN_MODE=manual`.
6. Anchor a sample receipt.
7. Verify the evidence JSON with `npm run anchor:verify`.
8. Only after successful pilot testing consider relayer mode.

## Customer experience

The customer sees:

```text
Receipt verified on-chain
Network: Sepolia or Ethereum
Receipt hash: 0x...
Explorer link: open
```

They should not see:

```text
Buy ETH
Approve token
Switch network
Connect wallet
Pay gas
```

## Mainnet rule

Mainnet anchoring should be treated as a production feature. It requires source verification, monitoring, a relayer policy, cost controls, and a rollback procedure.
