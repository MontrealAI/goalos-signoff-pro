# v47 validation expectations

The v47 workflow should pass:

- build-goalos-highest-command-center-v47
- repair-goalos-command-safety-v47
- verify-goalos-highest-command-center-v47
- existing production gate, when present
- existing public-safe gate, when present

Required properties:

- front-and-center command box uses contenteditable + role textbox;
- no native form, text field, upload, select, or textarea tags;
- no external AI calls by default;
- all pages retain one legal rail and one footer;
- all pages remain searchable through the route catalog;
- 48 contract rails are indexed when the config is present.
