export interface DashboardTrendPoint {
    date: string;
    orders: number;
    revenue: number;
}

export interface DashboardRecentOrder {
    _id: string;
    customerName: string;
    items: {
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: string;
}
// The ranges live next to the API's validation, so the page and the server can't drift apart
import type { DashboardRange } from "@/features/dashboard/schemas/dashboardRange";
export type { DashboardRange };

export interface DashboardStats {
    totalOrdersInRange: number;
    totalRevenueInRange: number;
    pendingOrders: number;
    averageOrderValue: number;
    trend: DashboardTrendPoint[];
    recentOrders: DashboardRecentOrder[];
    statusBreakdown: {
        pending: number;
        processing: number;
        completed: number;
        cancelled: number;
    };
    lowStockProducts: {
        _id: string;
        name: string;
        stock: number;
    }[];
    range: DashboardRange;
}