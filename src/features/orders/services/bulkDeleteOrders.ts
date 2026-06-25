import { api } from "@/services/api";

export const bulkDeleteOrders = async (ids: string[]) => {
    const response = await api.delete("orders", {
        data: { ids },
    });

    return response.data;
};