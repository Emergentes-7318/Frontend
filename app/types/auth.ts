// Auth Types
export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
