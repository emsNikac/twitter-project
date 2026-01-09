import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { loginRequest, registerRequest } from '../api/auth.api';

type JwtPayload = {
    sub: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, picture?: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const[userId, setUserId] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        const response = await loginRequest(email, password);
        const token = response.data.access_token;

        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);

        await AsyncStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const register = async(
        username: string,
        email: string,
        password: string,
        picture?: string,
    ) => {
        const response = await registerRequest(
            {
                username,
                email,
                password,
                picture
            }
        );

        const token = response.data.access_token;

        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);

        await AsyncStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUserId(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={ { isAuthenticated, userId, login, register, logout } } >
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): AuthContextType => {
    const authContextCheck = useContext(AuthContext);
    if(!authContextCheck){
        throw new Error('useAuth() must be used inside an AuthProvider');
    } 
    return authContextCheck;

}

