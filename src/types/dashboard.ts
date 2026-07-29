export interface DashboardTrendPoint {
    date: string;
    orders: number;
    revenue: number;
}

export interface DashboardRecentOrder {
    _id: string;
    customerName: string;
    productName: string;
    price: number;
    status: string;
    createdAt: string;
}

export type DashboardRange = '7d' | '30d' | '90d' | 'this-month'

export interface DashboardStats {
    totalOrdersThisMonth: number;
    totalRevenueThisMonth: number;
    pendingOrders: number;
    averageOrderValue: number;
    trend: DashboardTrendPoint[];
    recentOrders: DashboardRecentOrder[];
    statusBreakdown: {
        pending: number;
        processing: number;
        completed: number;
    };
}