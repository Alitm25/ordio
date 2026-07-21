//Login Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: {
        id: string;
        email: string;
    };
}

//Register Types
export interface RegisterRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
    };
}

//Current user Types
export interface CurrentUserResponse {
    user: {
        id: string;
        email: string;
        createdAt: string;
    }
}