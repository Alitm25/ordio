import {api} from "@/services/api";

export const getOrders = async () => {
    const token = localStorage.getItem('token');

    console.log(`Bearer ${token}`)

    const response = await api.get(`orders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
}