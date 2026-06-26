# AI Evidence Assistant Specification

**Product:** GoalOS Signoff Pro v1.1  
**Audience:** GoalOS team, pilot customers, operators  
**Owner:** GoalOS product and operations  
**Status:** Ready for private beta  
**Version:** 1.1.0  
**Updated:** 2026-06-26T00:05:06Z

> What the assistant checks and what it must never claim.

---

## Role of the assistant

The assistant prepares the human review. It does not replace human acceptance.

## It checks

- Each acceptance criterion has evidence
- Required file types are present
- Links are reachable
- Sources have dates when required
- Limitations are disclosed
- AI-use disclosure exists when configured
- Evidence is mapped to the correct criterion
- Revision comments were addressed

## It flags

| Flag | Meaning | Suggested user copy |
| --- | --- | --- |
| Missing evidence | No mapped file/link for a criterion | This criterion has no evidence attached. |
| Weak limitation disclosure | Limitations are absent or short | Add what remains uncertain before acceptance. |
| Unmapped file | File exists but supports no criterion | Map this file to a criterion or remove it. |
| Old source | Source date violates freshness rule | This source may be too old for the brief. |
| Human review required | Subjective judgment needed | GoalOS cannot verify this automatically. Please review manually. |


## It must never say

- This report is true
- This work is legally compliant
- This source is authoritative in all contexts
- This work is safe to deploy
- This reviewer is correct
- This should be paid automatically

## Confidence language

Use:

```text
GoalOS found no missing required evidence.
```

Do not use:

```text
GoalOS proves the work is correct.
```

## Human authority line

Every review page should show:

> GoalOS checks completeness and evidence coverage. Final acceptance is a human decision.
