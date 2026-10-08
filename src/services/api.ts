import axios from "axios";

// base API URL
export const api = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    }
})

// Every response passes through here first.
// A 401 means the login expired (e.g. a tab left open for days): send the user to the login page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        // a wrong password on the login form is also a 401, that one must stay on the page
        const isAuthRequest = error.config?.url?.includes("auth/");

        if (isUnauthorized && !isAuthRequest && window.location.pathname !== "/login") {
            // full page load: the proxy deletes the dead cookie and the in-memory cache is wiped
            window.location.href = "/login";
        }

        // still reject, so the calling code (React Query, try/catch) knows the request failed
        return Promise.reject(error);
    }
);
