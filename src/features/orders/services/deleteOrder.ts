import {api} from "@/services/api";

export const deleteOrder = async (id: string) => {
    const response = await api.delete(`orders/${id}`);

    return response;
}