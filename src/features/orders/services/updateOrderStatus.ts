import { api } from "@/services/api";

export const updateOrderStatus = async ({id, status,}: { id: string; status: string; }) => {
    const response = await api.patch(`orders/${id}`, { status });

    return response.data;
};