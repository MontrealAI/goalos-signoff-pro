import { optionalEmailEnv } from "@/lib/env";

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[character] ?? character));

export async function sendInvitationEmail(input: { to: string; projectTitle: string; role: string; inviteUrl: string }) {
  const { apiKey, from } = optionalEmailEnv();
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `You are invited to ${input.projectTitle} in GoalOS Signoff`,
      html: `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto"><h1>GoalOS Signoff</h1><p>You were invited as <strong>${escapeHtml(input.role)}</strong> for <strong>${escapeHtml(input.projectTitle)}</strong>.</p><p><a href="${escapeHtml(input.inviteUrl)}" style="display:inline-block;background:#12261f;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Open invitation</a></p><p>This link expires in seven days. Do not forward it.</p></div>`
    })
  });
  if (!response.ok) throw new Error(`Invitation email failed (${response.status}).`);
  return { sent: true };
}
