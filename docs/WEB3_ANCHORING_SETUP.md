# Optional Web3 Anchoring Setup

This package includes an optional `web3-anchor/` module. It is separated from the mainstream app so ordinary customers do not need a wallet.

## What anchoring does

Anchoring records only hashes and public identifiers. It does not upload private documents, hold funds, or approve tokens.

A verified anchor can prove:

- the receipt existed at or before the block time;
- the receipt hash later shown to the verifier matches the anchored hash;
- the same project, evidence docket, review, and final decision were accepted.

## Recommended rollout

1. Deploy `web3-anchor/contracts/GoalOSSignoffRegistryV1.sol` to Sepolia.
2. Run a private pilot with test ETH only.
3. Connect the commercial app to the Sepolia registry through `NEXT_PUBLIC_SIGNOFF_ANCHOR_CHAIN_ID=11155111` and `NEXT_PUBLIC_SIGNOFF_ANCHOR_REGISTRY=...`.
4. Keep Mainnet anchoring off until legal, security, operations and monitoring gates are complete.

## Customer UX

The mainstream customer should see a single optional button:

> Verify this receipt on-chain

GoalOS may sponsor gas for commercial plans later. During the pilot, use Sepolia test ETH.

## What not to store on-chain

Never put confidential deliverables, email addresses, names, source documents, passwords, API keys, medical data, financial account data, or private notes on-chain. Store only hashes and public CIDs.
