# GoalOS Signoff Pro v45 — Front-and-Center Command OS

v45 is a separate, preservation-first user interface layer.

It makes one experience primary:

> Tell GoalOS what you want.

GoalOS then turns the request into a mission, acceptance criteria, evidence checklist, reviewer route, protocol rail map, recommended page, and synthetic Mission Receipt.

## Public-safe behavior

The command box is browser-local by default. The static GitHub Pages site does not call an external model provider, expose API keys, connect wallets, move value, write cookies, or require personal/confidential data.

## Why no HTML form controls

The existing GoalOS production gate blocks `<form>`, `<input>`, `<textarea>`, and `<select>`. v45 therefore implements the text box with `contenteditable` plus `role="textbox"`, preserving a natural command experience while passing the production verifier.

## Preservation rule

v45 does not remove pages. It preserves the classic homepage as `classic-home-before-v45.html`, creates `all-pages.html`, and injects a small Ask GoalOS launcher across existing HTML pages.

## Best public entry points

- `goalos-universal-command-center.html`
- `tell-goalos.html`
- `all-pages.html`
- `agialpha-48-contract-atlas.html`
- `mission-001.html`
