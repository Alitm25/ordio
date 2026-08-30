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
export type DashboardRange = '7d' | '30d' | '90d' | 'this-month'

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