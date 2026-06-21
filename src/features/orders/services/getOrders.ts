import { api } from "@/services/api";

export const getOrders = async () => {
    const response = await api.get("orders");

    return response.data;
};