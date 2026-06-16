import { api } from "@/services/api";

export interface CreateOrderPayload {
    customerName: string;
    customerPhone: string;
    productName: string;
    quantity: number;
    price: number;
}

export const createOrder = async ( data: CreateOrderPayload) => {
    const token = localStorage.getItem("token");

    const response = await api.post(
        "orders",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};