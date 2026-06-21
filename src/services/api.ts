import axios from "axios";

// base API URL
export const api = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    }
})

