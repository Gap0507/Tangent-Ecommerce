/**
 * Centralized Shiprocket Authentication & Token Caching Service
 *
 * Shiprocket authentication tokens are valid for 10 days (240 hours).
 * Requesting a new token on every API call (especially during checkout pin code calculation)
 * triggers Shiprocket's strict IP rate limits and adds 300-800ms of needless network latency.
 *
 * This module caches the token in-memory with automatic 24-hour refresh and
 * concurrent in-flight promise deduplication.
 */

let cachedToken: string | null = null;
let cachedEmail: string | null = null;
let tokenExpiresAt: number = 0;
let pendingAuthPromise: Promise<string | null> | null = null;

// Cache tokens for 24 hours (safely below Shiprocket's 10-day expiration)
const TOKEN_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function getShiprocketToken(
  email: string,
  apiKeyOrPassword: string
): Promise<string | null> {
  const cleanEmail = (email || "").trim();
  const cleanPassword = (apiKeyOrPassword || "").trim();

  if (!cleanEmail || !cleanPassword) {
    return null;
  }

  // Return cached token if valid and credentials match
  if (
    cachedToken &&
    cachedEmail === cleanEmail &&
    Date.now() < tokenExpiresAt
  ) {
    return cachedToken;
  }

  // Deduplicate concurrent login requests
  if (pendingAuthPromise) {
    return pendingAuthPromise;
  }

  pendingAuthPromise = (async () => {
    try {
      const authRes = await fetch(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPassword,
          }),
        }
      );

      const authData = await authRes.json();

      if (authData && authData.token) {
        cachedToken = authData.token;
        cachedEmail = cleanEmail;
        tokenExpiresAt = Date.now() + TOKEN_CACHE_TTL_MS;
        return cachedToken;
      } else {
        console.error("Shiprocket login error response:", authData);
        cachedToken = null;
        return null;
      }
    } catch (err) {
      console.error("Failed to connect to Shiprocket auth endpoint:", err);
      cachedToken = null;
      return null;
    } finally {
      pendingAuthPromise = null;
    }
  })();

  return pendingAuthPromise;
}

export function clearShiprocketTokenCache(): void {
  cachedToken = null;
  cachedEmail = null;
  tokenExpiresAt = 0;
  pendingAuthPromise = null;
}
