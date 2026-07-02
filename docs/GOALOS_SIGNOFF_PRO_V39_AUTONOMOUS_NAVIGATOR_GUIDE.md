# GoalOS Signoff Pro v39 — Autonomous Site Navigator Guide

## Purpose

v39 adds a chat-style site navigator that answers public website questions and routes the visitor to the right page.

It is designed for static GitHub Pages and therefore does not expose any AI API key, wallet action, payment action, analytics endpoint, or user-data collection.

## Why browser-local by default

A true LLM chat requires a server-side endpoint, rate limits, abuse controls, moderation, privacy disclosures, and secret management. A public GitHub Pages site must not expose API keys in client JavaScript.

The v39 default is therefore a deterministic local answer router. It feels like a live assistant, but it uses a static knowledge map and route catalog.

## Supported user journeys

- First-time visitor: route to the command center.
- AI consultant: route to the product-first Signoff console.
- Client reviewer: route to evidence, receipt, and Mission 001 pages.
- DAO/treasury user: route to proof-mandate and proof-before-settlement pages.
- Protocol operator: route to the 48-contract atlas and individual contract pages.
- Auditor/reviewer: route to replay, claim boundary, validation, and contract rails.
- RSI/ASI governance visitor: route to v32-v35 governance simulators.

## Implementation files

- `site/assets/goalos-v39-navigator.css`
- `site/assets/goalos-v39-navigator.js`
- `site/ask-goalos.html`
- `site/goalos-v22-v39-command-center.html`
- `site/goalos-v39-navigator-knowledge.json`
- `scripts/build-autonomous-site-navigator-v39.mjs`
- `scripts/verify-autonomous-site-navigator-v39.mjs`

## Optional future live AI backend

A future production version may add a server-side API endpoint, but only after:

- privacy policy update;
- abuse/rate-limit design;
- prompt-injection defenses;
- source-grounded retrieval;
- logging/redaction policy;
- incident response path;
- no secrets in client code.

The public static v39 package intentionally avoids that risk.
