import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { PublicProfile, updateMeRequest } from '../api/users.api';
import { loginRequest, registerRequest, getMeRequest } from '../api/auth.api';

type JwtPayload = {
    sub: string;
};

type User = PublicProfile & {
    bio?: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    userId: string | null;
    user: User | null;
    refreshMe: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, picture?: string) => Promise<void>;
    updateMe: (payload: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const loadMe = async () => {
        const result = await getMeRequest();
        setUser(result.data);
    }
    
    const refreshMe = async () => {
        await loadMe();
    };

    const updateMe = async (payload: Partial<User>) => {
        const result = await updateMeRequest(payload);
        setUser(result.data);
    };

    const login = async (email: string, password: string) => {
        const response = await loginRequest(email, password);
        const token = response.data.access_token;
        
        await AsyncStorage.setItem('token', token);
        
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);
        setIsAuthenticated(true);

        await loadMe();
    };

    const register = async (
        username: string,
        email: string,
        password: string,
        picture?: string,
    ) => {
        const response = await registerRequest({ username, email, password, picture });
        const token = response.data.access_token;

        await AsyncStorage.setItem('token', token);

        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);
        setIsAuthenticated(true);

        await loadMe();
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUserId(null);
        setUser(null);
        setIsAuthenticated(false);
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, user, refreshMe, login, register, updateMe, logout }} >
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): AuthContextType => {
    const authContextCheck = useContext(AuthContext);
    if (!authContextCheck) {
        throw new Error('useAuth() must be used inside an AuthProvider');
    }
    return authContextCheck;

}
