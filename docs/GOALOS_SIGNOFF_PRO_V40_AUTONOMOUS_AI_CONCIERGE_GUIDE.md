# GoalOS Signoff Pro v40 — Autonomous AI Concierge Guide

## Purpose

The requested experience is a website chat window where visitors can ask questions, receive answers live/autonomously, and be routed to the right place in the site.

v40 implements that as a local-first public-safe concierge.

## Why local-first

GitHub Pages is a static host. A true model-backed chat must not put API keys in browser code. Therefore v40 ships with:

1. a browser-local answer router enabled by default;
2. a route allowlist generated from the site;
3. a knowledge map covering product, proof labs, contracts, and RSI/ASI pages;
4. an optional server-side endpoint specification for later live AI mode.

## User flow

Ask -> answer -> recommended route -> countdown redirect -> inspect proof object.

## Best-practice controls

- Local question field by default.
- No uploads.
- No cookies or analytics.
- No external AI call by default.
- No wallet or payment flow.
- Same-site route allowlist.
- Cancelable auto-route.
- Optional server endpoint must be rate-limited, origin-locked, and secret-managed.

## Do not say

Do not say the v40 chat page has “no text inputs.” It has a local question input. Say: “local question input; no transmission by default.”
