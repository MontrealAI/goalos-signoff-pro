# Hybrid Operating Model

## Day-one product

Run the SaaS version like a normal commercial app: authentication, private uploads, role-based project access, emails, support, billing, and signed PDF/JSON receipts.

## Optional anchoring service

When a customer requests a verified receipt, the app computes a receipt hash and sends it to the anchoring workflow. The workflow can be manual in private beta and automated later.

## Security split

- Supabase stores private collaboration data.
- The blockchain stores only hashes and public receipt metadata.
- No wallet key or seed is stored in the SaaS.
- No production escrow is enabled in this package.

## Operational controls

- Keep anchoring feature-flagged.
- Verify each contract deployment.
- Monitor failed anchors.
- Allow receipt revocation inside the SaaS, but preserve the historical anchor.
- Provide a verifier page showing whether the receipt is SaaS-signed, chain-anchored, revoked, or superseded.

## Recommended pricing

| Offer | Suggested price |
|---|---:|
| Signoff Basic | Free to $49/month |
| Team Signoff | $199–$499/month |
| Verified receipt anchoring | $5–$15 per receipt or included |
| Human review | $99–$299 per mission |
| Future proof-to-payment | % fee with cap, after authorization |
