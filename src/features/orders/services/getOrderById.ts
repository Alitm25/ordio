import {Order} from "@/types/order";
import {api} from "@/services/api";

export const getOrderById = async (id :string):Promise<{ order: Order }> => {
    const response = await api.get(`orders/${id}`);
    return response.data;
}