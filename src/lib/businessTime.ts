// "Today", "this month" and day-by-day charts must follow the SHOP's clock, not the server's.
// (A server running in UTC would otherwise start each day 3.5 hours late for a shop in Iran.)
export const BUSINESS_TIME_ZONE = "Asia/Tehran";

// Calendar day of a moment, in the shop's time zone: "2026-10-17"
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export function dayKey(date: Date): string {
    return dayFormatter.format(date);
}

// Move a calendar day forward/back: addDays("2026-10-01", -1) -> "2026-09-30"
export function addDays(key: string, days: number): string {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

// How far the shop's clock is ahead of UTC at a given moment (in ms)
const partsFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

function offsetMs(date: Date): number {
    const parts = Object.fromEntries(partsFormatter.formatToParts(date).map((p) => [p.type, Number(p.value)]));
    const shopClockAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return shopClockAsUtc - (date.getTime() - date.getMilliseconds());
}

// The exact moment a calendar day begins in the shop: startOfDay("2026-10-17") -> 2026-10-16T20:30:00Z
export function startOfDay(key: string): Date {
    const midnightAsIfUtc = new Date(`${key}T00:00:00Z`);
    return new Date(midnightAsIfUtc.getTime() - offsetMs(midnightAsIfUtc));
}
