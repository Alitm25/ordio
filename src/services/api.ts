import axios from "axios";

// base API URL
export const api = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    }
})

// Interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)