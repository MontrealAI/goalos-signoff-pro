# GoalOS From Loop to RSI v32 — Validation

The v32 validation gate checks:

- all v32 public routes exist;
- each route has exactly one `data-goalos-legal-rail="v12"` marker;
- each route has exactly one footer;
- no forms or input elements are present;
- no analytics, cookies, wallet actions, payment language, live settlement language, or contact-email leakage appears;
- all v32 JSON artifacts are present and parse;
- the RSI manifest defines eight deterministic invention stages;
- the governance gates are present;
- optional source PDFs are present if supplied.
