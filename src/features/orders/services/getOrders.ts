import { api } from "@/services/api";
import {Order} from "@/types/order";
import { OrderSortField } from "@/features/orders/schemas/createOrderSchema";


export interface GetOrdersParams {
    search?: string;
    status?: string;
    sortBy?: OrderSortField;
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

export const getOrders = async (params: GetOrdersParams) :Promise<GetOrdersResponse> => {
    const response = await api.get("orders", { params });

    return response.data;
};