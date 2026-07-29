import {api} from "@/services/api";
import {DashboardRange, DashboardStats} from "@/types/dashboard";

export const getDashboardStats = async (range :DashboardRange = 'this-month') :Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('dashboard/stats', {
        params: { range }
    });

    return response.data;
}