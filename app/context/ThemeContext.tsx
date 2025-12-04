"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkModeState] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load dark mode preference from localStorage
        const savedDarkMode = localStorage.getItem('darkMode');

        // If no preference is saved, default to light mode (false)
        const isDark = savedDarkMode === 'true';

        setDarkModeState(isDark);
        setIsInitialized(true);

        // Apply or remove dark mode class to html element
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            // Ensure dark mode is removed by default
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const setDarkMode = (value: boolean) => {
        setDarkModeState(value);
        localStorage.setItem('darkMode', value.toString());

        if (value) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Don't render children until theme is initialized to prevent flash
    if (!isInitialized) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
