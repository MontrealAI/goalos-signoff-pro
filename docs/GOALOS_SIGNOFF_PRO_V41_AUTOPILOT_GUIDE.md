# GoalOS v41 Autopilot Guide

The v41 Autopilot is a separate layer above the existing website. It does not replace earlier pages. It helps visitors translate plain-language intent into the right GoalOS workflow.

## Product philosophy

The first product remains GoalOS Signoff: define done, submit evidence, check the evidence, review, and issue a Mission Receipt.

The 48 contracts and `$AGIALPHA` are protocol rails underneath the customer experience. They should activate only when a tier requires verified commitments, reviewer bonds, credentialing, disputes, rewards, or settlement.

## Why local-first

A static GitHub Pages site should not expose model-provider keys. The v41 public console therefore runs a deterministic browser-local planner by default, with an optional server-side endpoint adapter for future live-AI mode.

## UX behavior

The user enters one plain-language request. The page then generates a mission plan, evidence checklist, proof object map, recommended page, protocol rail map, and synthetic receipt.
