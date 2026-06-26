export type PilotEventName = "signoff_created" | "builder_invited" | "evidence_uploaded" | "submission_created" | "review_recorded" | "decision_recorded" | "receipt_issued" | "anchor_requested";
export type PilotEvent = { name: PilotEventName; projectId?: string; userId?: string; metadata?: Record<string, unknown>; occurredAt: string };
export const pilotMetrics = [
  { key: "attempted_signoffs", label: "Attempted Signoffs", target: 10 },
  { key: "completed_signoffs", label: "Completed Signoffs", target: 7 },
  { key: "repeat_intent", label: "Users who would use again", target: 3 },
  { key: "broken_receipts", label: "Broken receipts", target: 0 },
  { key: "lost_evidence", label: "Lost evidence", target: 0 },
  { key: "security_incidents", label: "Security incidents", target: 0 }
] as const;
export function summarizePilot(events: PilotEvent[]) {
  return {
    attemptedSignoffs: events.filter((event) => event.name === "signoff_created").length,
    completedSignoffs: events.filter((event) => event.name === "receipt_issued").length,
    anchoringRequests: events.filter((event) => event.name === "anchor_requested").length,
    lastEventAt: events.map((event) => event.occurredAt).sort().at(-1) ?? null
  };
}
