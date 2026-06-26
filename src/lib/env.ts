const clean = (value: string | undefined) => value?.trim() || undefined;

export function publicSupabaseEnv() {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ?? clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return { url, key, configured: Boolean(url && key) };
}

export function serverSupabaseEnv() {
  const publicEnv = publicSupabaseEnv();
  const secretKey = clean(process.env.SUPABASE_SECRET_KEY) ?? clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return { ...publicEnv, secretKey, serverConfigured: Boolean(publicEnv.configured && secretKey) };
}

export function appUrl() {
  const configured = clean(process.env.NEXT_PUBLIC_APP_URL);
  if (configured) return configured;
  const vercelHost = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? clean(process.env.VERCEL_URL);
  if (vercelHost) return vercelHost.startsWith("http") ? vercelHost : `https://${vercelHost}`;
  return "http://localhost:3000";
}

export function signingEnv() {
  const privateKey = clean(process.env.RECEIPT_SIGNING_PRIVATE_KEY_PEM)?.replace(/\\n/g, "\n");
  const publicKey = clean(process.env.RECEIPT_SIGNING_PUBLIC_KEY_PEM)?.replace(/\\n/g, "\n");
  const keyId = clean(process.env.RECEIPT_SIGNING_KEY_ID) ?? "goalos-signoff-local";
  return { privateKey, publicKey, keyId, configured: Boolean(privateKey && publicKey) };
}

export function optionalEmailEnv() {
  return {
    apiKey: clean(process.env.RESEND_API_KEY),
    from: clean(process.env.RESEND_FROM_EMAIL) ?? "GoalOS Signoff <signoff@example.com>"
  };
}
