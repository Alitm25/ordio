import { api } from "@/services/api";

export interface CreateOrderPayload {
    customerName: string;
    customerPhone: string;
    productName: string;
    quantity: number;
    price: number;
}

export const createOrder = async (data: CreateOrderPayload) => {
    const response = await api.post("orders", data);

    return response.data;
};