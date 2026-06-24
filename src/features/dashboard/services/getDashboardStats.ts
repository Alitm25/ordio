import {api} from "@/services/api";
import {DashboardStats} from "@/types/dashboard";

export const getDashboardStats = async () :Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('dashboard/stats');

    return response.data;
}