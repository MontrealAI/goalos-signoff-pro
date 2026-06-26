"use client";
import { useRef, useState } from "react";
import { FileUp, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { sha256File } from "@/lib/browser-crypto";
import { requestJson } from "@/lib/client-api";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const mimeByExtension: Record<string, string> = {
  pdf: "application/pdf", json: "application/json", zip: "application/zip", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain", md: "text/markdown", csv: "text/csv", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp"
};

function inferMime(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return mimeByExtension[extension] ?? "application/octet-stream";
}

export function ArtifactUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [state, setState] = useState<{ stage: string | null; error: string | null }>({ stage: null, error: null });
  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setState({ stage: "Fingerprinting file…", error: null });
    try {
      const sha256 = await sha256File(file);
      const mimeType = inferMime(file);
      setState({ stage: "Creating secure upload…", error: null });
      const intent = await requestJson<{ intentId: string; path: string; token: string }>(`/api/projects/${projectId}/uploads`, { method: "POST", body: JSON.stringify({ filename: file.name, mimeType, sizeBytes: file.size, sha256, description }) });
      setState({ stage: "Uploading privately…", error: null });
      const supabase = createBrowserSupabaseClient();
      const uploadResult = await supabase.storage.from("signoff-artifacts").uploadToSignedUrl(intent.path, intent.token, file, { contentType: mimeType });
      if (uploadResult.error) throw uploadResult.error;
      setState({ stage: "Verifying file fingerprint…", error: null });
      await requestJson(`/api/projects/${projectId}/uploads/finalize`, { method: "POST", body: JSON.stringify({ intentId: intent.intentId }) });
      setFile(null);
      setDescription("");
      if (inputRef.current) inputRef.current.value = "";
      setState({ stage: null, error: null });
      router.refresh();
    } catch (error) {
      setState({ stage: null, error: error instanceof Error ? error.message : "Upload failed." });
    }
  }
  return <form className="card" onSubmit={upload}><div className="row"><span className="icon-box" style={{ margin: 0 }}><FileUp size={19} /></span><div><h3>Add evidence</h3><p className="muted small" style={{ margin: 0 }}>Files remain private. Maximum 25 MB each.</p></div></div><div className="form-grid" style={{ marginTop: 18 }}><div className="field"><label htmlFor="artifact-file">File</label><input ref={inputRef} id="artifact-file" className="input" type="file" required onChange={(event) => setFile(event.target.files?.[0] ?? null)} accept=".pdf,.json,.zip,.docx,.xlsx,.pptx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp" /></div><div className="field"><label htmlFor="artifact-description">Description</label><input id="artifact-description" className="input" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does this file prove?" maxLength={1000} /></div></div>{state.error && <div className="notice error" style={{ marginTop: 14 }}>{state.error}</div>}<div className="form-actions"><button className="button" disabled={!file || Boolean(state.stage)}>{state.stage ? <><LoaderCircle size={16} /> {state.stage}</> : "Upload and verify"}</button></div></form>;
}
