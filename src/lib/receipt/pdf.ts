import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { ReceiptEnvelope } from "@/lib/receipt/public";

const PAGE = { width: 595.28, height: 841.89, margin: 48 };

function pdfSafe(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\x7E\n\r\t]/g, "?");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = pdfSafe(text).replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export async function createReceiptPdf(envelope: ReceiptEnvelope): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  let page = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - PAGE.margin;
  const receipt = envelope.record.canonical_json;

  const ensure = (space: number) => {
    if (y - space < PAGE.margin) {
      page = pdf.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - PAGE.margin;
    }
  };
  const text = (value: string, options: { size?: number; font?: PDFFont; gap?: number; color?: ReturnType<typeof rgb>; maxWidth?: number } = {}) => {
    const size = options.size ?? 10;
    const font = options.font ?? regular;
    const gap = options.gap ?? 4;
    const lines = wrap(value, font, size, options.maxWidth ?? PAGE.width - PAGE.margin * 2);
    ensure(lines.length * (size + gap) + 4);
    for (const line of lines) {
      page.drawText(line, { x: PAGE.margin, y, size, font, color: options.color ?? rgb(0.08, 0.13, 0.11) });
      y -= size + gap;
    }
    y -= 2;
  };
  const heading = (value: string) => { ensure(30); y -= 6; text(value, { size: 14, font: bold, gap: 5 }); };

  page.drawRectangle({ x: 0, y: PAGE.height - 96, width: PAGE.width, height: 96, color: rgb(0.06, 0.15, 0.12) });
  page.drawText("GoalOS Signoff", { x: PAGE.margin, y: PAGE.height - 45, size: 22, font: bold, color: rgb(0.96, 0.98, 0.96) });
  page.drawText("Mission Receipt", { x: PAGE.margin, y: PAGE.height - 70, size: 12, font: regular, color: rgb(0.74, 0.87, 0.8) });
  y = PAGE.height - 125;
  const receiptStatus = !envelope.verified ? "SIGNATURE VERIFICATION FAILED" : envelope.revokedAt ? "AUTHENTIC RECEIPT — REVOKED" : "AUTHENTIC SIGNATURE VERIFIED";
  text(receiptStatus, { size: 10, font: bold, color: envelope.valid ? rgb(0.05, 0.45, 0.24) : rgb(0.7, 0.08, 0.08) });
  if (envelope.revokedAt) {
    text(`Revoked: ${new Date(envelope.revokedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC`, { size: 9, font: bold, color: rgb(0.7, 0.08, 0.08) });
    text(`Reason: ${envelope.revocationReason ?? "No reason recorded."}`, { size: 8.5, color: rgb(0.7, 0.08, 0.08) });
  }
  text(receipt.mission.title, { size: 19, font: bold, gap: 7 });
  text(receipt.mission.summary, { size: 10 });
  text(`Receipt: ${receipt.publicId} - Issued: ${new Date(receipt.issuedAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC`, { size: 8, color: rgb(0.35, 0.4, 0.38) });

  heading("Final decision");
  text(receipt.finalDecision.decision.toUpperCase(), { size: 13, font: bold });
  text(receipt.finalDecision.comment);
  text(`Decision hash: ${receipt.finalDecision.decisionHash}`, { size: 7.5, font: mono });

  heading("Acceptance criteria");
  receipt.acceptanceCriteria.forEach((criterion, index) => {
    ensure(70);
    text(`${index + 1}. ${criterion.title} — ${criterion.responseStatus.toUpperCase()}`, { size: 10, font: bold });
    if (criterion.description) text(criterion.description, { size: 8.5, color: rgb(0.35, 0.4, 0.38) });
    text(criterion.response, { size: 9 });
    if (criterion.evidenceArtifactHashes.length) text(`Evidence: ${criterion.evidenceArtifactHashes.join(", ")}`, { size: 7, font: mono });
    y -= 5;
  });

  heading("Evidence artifacts");
  receipt.artifacts.forEach((artifact) => {
    ensure(48);
    text(`${artifact.filename} (${Math.max(1, Math.round(artifact.sizeBytes / 1024))} KB)`, { size: 9.5, font: bold });
    if (artifact.description) text(artifact.description, { size: 8.5 });
    text(`SHA-256: ${artifact.sha256}`, { size: 7, font: mono });
  });

  heading("Mechanical checks");
  receipt.checks.forEach((check) => text(`${check.status.toUpperCase()} — ${check.label}: ${check.detail}`, { size: 8.5 }));

  heading("Limitations and AI-use disclosure");
  text(`Limitations: ${receipt.submission.limitations || "None disclosed."}`, { size: 9 });
  text(`AI use: ${receipt.submission.aiUseNotes || "Not disclosed."}`, { size: 9 });

  heading("Integrity and future protocol compatibility");
  text("This receipt records human acceptance and mechanical completeness checks. It does not independently certify every external factual claim or professional conclusion.", { size: 8.5 });
  text(`Mission commitment: ${receipt.mission.commitmentHash}`, { size: 7, font: mono });
  text(`Evidence docket: ${receipt.submission.evidenceDocketHash}`, { size: 7, font: mono });
  text(`Proof bundle: ${receipt.protocolReady.proofBundleHash}`, { size: 7, font: mono });
  text(`Canonical receipt: ${envelope.record.canonical_sha256}`, { size: 7, font: mono });
  text(`Signature algorithm: ${envelope.record.algorithm} - Key: ${envelope.record.public_key_id}`, { size: 8 });

  for (const [index, current] of pdf.getPages().entries()) {
    current.drawText(`GoalOS Signoff - ${pdfSafe(receipt.publicId)} - Page ${index + 1}/${pdf.getPageCount()}`, { x: PAGE.margin, y: 24, size: 7, font: regular, color: rgb(0.45, 0.48, 0.46) });
  }
  pdf.setTitle(`GoalOS Signoff Receipt ${receipt.publicId}`);
  pdf.setSubject("Human-authorized acceptance receipt for AI-assisted work");
  pdf.setCreator("GoalOS Signoff");
  return pdf.save();
}
