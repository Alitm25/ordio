import { api } from "@/services/api";
import {Order} from "@/types/order";


export interface GetOrdersParams {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface GetOrdersResponse {
    orders: Order[];
    totalCount: number;
    totalPages: number;
    page: number;
}

export const getOrders = async () => {
    const response = await api.get("orders");

    return response.data;
};