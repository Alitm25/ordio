import { api } from "@/services/api";
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "@/types/auth";

// Login API
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

//Register API
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
        "/auth/register",
        data
    );

    return response.data;
};