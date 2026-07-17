import {api} from "@/services/api";
import {Customer} from "@/types/customer";
import {id} from "zod/locales";

export interface CustomerPayload {
    name: string;
    phone: string;
    notes?: string;
}


// Get customers API
export const getCustomers = async () :Promise<{ customers: Customer[] }> => {
    const response = await api.get<{ customers: Customer[] }>("customers");
    return response.data;
}

// Post (Create) customer API
export const createCustomer = async (
    data: CustomerPayload
) :Promise<{ customer: Customer }> => {
    const response = await api.post<{ customer: Customer }>("customers", data);
    return response.data;
}

// Patch (edit) customer API
export const updateCustomer = async (
    { id, data }: { id: string; data: Partial<CustomerPayload> }) :Promise<{ customer: Customer }> => {
    const response = await api.patch<{ customer: Customer }>(`customers/${id}`, data);
    return response.data;
}

// Delete customer API
export const deleteCustomer = async (id: string): Promise<void> => {
    await api.delete(`customers/${id}`);
}