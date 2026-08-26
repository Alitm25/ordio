import {CreateOrderFormValues} from "@/features/orders/schemas/createOrderSchema";
import {api} from "@/services/api";

interface updateDataParams {
    id: string;
    data: Partial<CreateOrderFormValues>;
}

export const updateOrder = async ({id, data} :updateDataParams) => {
    const response = await api.patch(`orders/${id}`, data);

    return response.data;
}