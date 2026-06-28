import { api } from "@/services/api";
import {CreateOrderFormValues} from "@/features/orders/schemas/createOrderSchema";

export const createOrder = async (data: CreateOrderFormValues) => {
    const response = await api.post("orders", data);

    return response.data;
};