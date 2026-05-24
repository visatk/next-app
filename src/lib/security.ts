/**
 * Validates a Cloudflare Turnstile token.
 * Optimized for Cloudflare Workers / Web Fetch API.
 */
export async function validateTurnstile(token: string, ip?: string): Promise<boolean> {
  const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
  if (!SECRET_KEY) throw new Error("TURNSTILE_SECRET_KEY is missing");

  const formData = new URLSearchParams();
  formData.append('secret', SECRET_KEY);
  formData.append('response', token);
  if (ip) formData.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    
    const outcome = await res.json() as { success: boolean };
    return outcome.success;
  } catch (error) {
    console.error("Turnstile validation failed:", error);
    return false;
  }
}

/**
 * Checks KV for idempotency key. If exists, rejects. If not, sets it with 24hr TTL.
 * Requires binding `KV` in your open-next.config.ts / wrangler.jsonc
 */
export async function checkIdempotency(key: string, kvBinding: KVNamespace): Promise<boolean> {
  const exists = await kvBinding.get(`idemp:${key}`);
  if (exists) return false; // Already processed
  
  // Set key expiring in 86400 seconds (24 hours)
  await kvBinding.put(`idemp:${key}`, "1", { expirationTtl: 86400 });
  return true;
}
