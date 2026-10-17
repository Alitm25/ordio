import type { QueryClient } from "@tanstack/react-query";

// Everything an order change (create, edit, status, delete) can affect.
// Keys match by PREFIX: ["order"] refreshes every ["order", id], ["dashboardStats"] every range.
export function refreshOrderQueries(queryClient: QueryClient) {
    return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),         // the orders list
        queryClient.invalidateQueries({ queryKey: ["order"] }),          // the open order's detail panel
        queryClient.invalidateQueries({ queryKey: ["products"] }),       // stock is taken or given back
        queryClient.invalidateQueries({ queryKey: ["dashboardStats"] }), // KPIs, chart, low-stock list
    ]);
}
