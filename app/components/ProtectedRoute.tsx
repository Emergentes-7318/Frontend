"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated and not on auth pages, redirect to login
        if (!isAuthenticated && !pathname.startsWith('/auth')) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, pathname, router]);

    // Show loading or nothing while redirecting
    if (!isAuthenticated && !pathname.startsWith('/auth')) {
        return (
            <div className="flex justify-center items-center h-screen">
                <i className="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
            </div>
        );
    }

    return <>{children}</>;
}
