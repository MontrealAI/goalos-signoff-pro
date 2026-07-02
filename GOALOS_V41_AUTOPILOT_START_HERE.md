# GoalOS Signoff Pro — Universal Autopilot Command Console v41

## What this adds

A separate, public-safe Autopilot page where a visitor can type what they want and GoalOS turns it into:

- a mission type;
- acceptance criteria;
- evidence checklist;
- proof objects;
- reviewer / authority route;
- protocol rail map;
- recommended next page;
- synthetic Mission Receipt JSON.

## Flagship route

`goalos-autopilot.html`

Aliases: `autopilot.html`, `tell-goalos.html`, `universal-command-box.html`, `goalos-take-care-of-everything.html`, `mission-autopilot.html`, `intent-to-mission.html`, `v41.html`.

## Public-safe default

The text box is local by default. The static site does not upload prompts, use cookies, run analytics, connect wallets, move payments, or call external AI by default.

## Optional live AI

A serverless worker example is included for later production deployment. Do not put model-provider API keys in browser JavaScript.
