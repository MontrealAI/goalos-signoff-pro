# Web3 verification and anchoring

## What gets anchored

The product anchors a compact receipt payload:

- canonical receipt hash
- project/mission commitment hash
- evidence docket hash
- decision hash
- optional IPFS metadata hash
- issuer address
- timestamp and chain ID

The chain does **not** store private evidence or client content.

## Customer experience

Mainstream customer:

> “Make this receipt publicly verifiable.”

GoalOS pays the gas with a limited relayer and returns an explorer link.

Web3 customer:

> “Connect wallet and anchor/verify myself.”

## Safe launch setting

Start with Sepolia only:

```env
NEXT_PUBLIC_GOALOS_WEB3_MODE=sepolia
GOALOS_MAINNET_ANCHORING_ENABLED=false
```

Switch Mainnet on only after legal, security, privacy, operational, and incident-response readiness is complete.

## Relayer policy

The relayer should:

- hold only enough ETH for anchoring gas
- never hold customer funds
- never hold AGIALPHA user deposits
- be rate limited
- be monitored
- require human approval for production mode
- have a daily gas cap

## Verification

A public receipt verification page should check:

1. receipt signature is valid
2. local canonical hash equals displayed hash
3. on-chain anchor exists for that hash
4. chain ID and contract address match trusted settings
5. anchor timestamp and transaction hash are displayed
