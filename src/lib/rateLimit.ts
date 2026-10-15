// Counts events (e.g. failed logins) per key inside a time window.
// Kept in this server's memory: correct for ONE running server process. If the app ever runs as
// several instances, each one counts separately -> move the counters to a shared store (e.g. Redis).

interface Entry {
    count: number;
    resetAt: number; // timestamp (ms) when this key's window ends
}

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
    const entries = new Map<string, Entry>();

    const getActive = (key: string) => {
        const entry = entries.get(key);
        if (entry && entry.resetAt <= Date.now()) {
            entries.delete(key);
            return undefined;
        }
        return entry;
    };

    return {
        // Seconds to wait before trying again, or 0 if allowed right now
        retryAfterSeconds(key: string): number {
            const entry = getActive(key);
            if (!entry || entry.count < limit) return 0;
            return Math.ceil((entry.resetAt - Date.now()) / 1000);
        },

        // Count one more event for this key
        hit(key: string) {
            const entry = getActive(key);
            if (entry) {
                entry.count++;
            } else {
                entries.set(key, { count: 1, resetAt: Date.now() + windowMs });
            }

            // keep memory small: now and then, drop windows that are already over
            if (entries.size > 10_000) {
                for (const [k, e] of entries) {
                    if (e.resetAt <= Date.now()) entries.delete(k);
                }
            }
        },

        reset(key: string) {
            entries.delete(key);
        },
    };
}

// The visitor's IP. Behind a proxy/host (e.g. Liara), the real IP is the first one in x-forwarded-for.
export function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}
