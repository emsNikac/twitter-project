import { api } from "./client";

export type RegisterResponse = {
    access_token: string;
    user: {
        id: string;
        username: string;
        email: string;
        picture: string | null;
    };
};

export type LoginResponse = {
    access_token: string;
};

export const registerRequest = (
    data: {
        username: string;
        email: string;
        password: string;
        picture?: string;
    }) => {
    return api.post<RegisterResponse>(
        '/auth/register',
        data,
    );
};

export const loginRequest = (email: string, password: string) => {
    return api.post<LoginResponse>(
        '/auth/login',
        {
            email,
            password,
        }
    );
};

export const getMeRequest = () => {
    return api.get('/auth/me');
};
