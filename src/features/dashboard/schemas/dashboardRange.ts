import { z } from "zod";

// The dashboard's time ranges: ONE list, used by the range picker and checked by the API
export const DASHBOARD_RANGES = ["7d", "30d", "90d", "this_month"] as const;

export type DashboardRange = (typeof DASHBOARD_RANGES)[number];

// ?range=... on GET /api/dashboard/stats. Unknown values (e.g. "banana") are rejected instead of guessed.
export const dashboardQuerySchema = z.object({
    range: z.enum(DASHBOARD_RANGES).default("this_month"),
});
