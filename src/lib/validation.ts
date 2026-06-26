import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(5000),
  deadline: z.string().trim().optional().default(""),
  receipt_visibility: z.enum(["private", "link"]).default("private"),
  criteria: z.array(z.object({
    title: z.string().trim().min(3).max(240),
    description: z.string().trim().max(4000).default(""),
    required: z.boolean().default(true),
    position: z.number().int().min(0)
  })).min(1).max(20)
});

export const invitationSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  role: z.enum(["builder", "reviewer", "observer"])
});

export const uploadIntentSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(200),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  description: z.string().trim().max(1000).default("")
});

export const finalizeUploadSchema = z.object({ intentId: z.uuid() });

export const submissionSchema = z.object({
  summary: z.string().trim().min(20).max(10000),
  limitations: z.string().trim().max(10000),
  aiUseNotes: z.string().trim().max(10000),
  artifactIds: z.array(z.uuid()).min(1).max(50),
  responses: z.array(z.object({
    criterion_id: z.uuid(),
    status: z.enum(["met", "partial", "not_met", "not_applicable"]),
    response: z.string().trim().min(1).max(10000),
    artifact_ids: z.array(z.uuid()).max(50)
  })).min(1).max(20)
});

export const reviewSchema = z.object({
  recommendation: z.enum(["accept", "changes_requested", "reject"]),
  notes: z.string().trim().min(3).max(10000)
});

export const decisionSchema = z.object({
  decision: z.enum(["accepted", "changes_requested", "rejected"]),
  comment: z.string().trim().min(3).max(10000)
});

export const allowedMimeTypes = new Set([
  "application/pdf",
  "application/json",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/markdown",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp"
]);


const extensionsByMime: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/json": [".json"],
  "application/zip": [".zip"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "text/plain": [".txt", ".log"],
  "text/markdown": [".md", ".markdown"],
  "text/csv": [".csv"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"]
};

export function isAllowedFilePair(filename: string, mimeType: string) {
  const lower = filename.toLowerCase();
  return Boolean(extensionsByMime[mimeType]?.some((extension) => lower.endsWith(extension)));
}

export function safeFilename(filename: string) {
  const basename = filename.split(/[\\/]/).pop() ?? "artifact";
  const normalized = basename
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "");
  return normalized.slice(0, 120) || "artifact";
}
