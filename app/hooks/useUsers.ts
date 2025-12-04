import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    getUserById: (userId: string) => User | undefined;
    getUsernameById: (userId: string) => string;
}

export function useUsers(): UseUsersReturn {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${apiUrl}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al cargar usuarios');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [apiUrl, router]);

    const getUserById = (userId: string): User | undefined => {
        return users.find(user => user.id === userId);
    };

    const getUsernameById = (userId: string): string => {
        const user = getUserById(userId);
        if (user) {
            return user.username;
        }
        // Return shortened UUID if user not found
        return userId.substring(0, 8) + '...';
    };

    return {
        users,
        loading,
        error,
        getUserById,
        getUsernameById
    };
}
