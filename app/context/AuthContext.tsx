"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '@/app/types/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load user and token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (authResponse: AuthResponse) => {
        setToken(authResponse.access_token);
        setUser(authResponse.user);
        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('user', JSON.stringify(authResponse.user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
