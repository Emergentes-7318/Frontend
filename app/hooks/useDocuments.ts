import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Document, UpdateDocumentDto } from '@/app/types/document';

interface UseDocumentsReturn {
    documents: Document[];
    loading: boolean;
    uploading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateDocument: (id: string, data: UpdateDocumentDto) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<void>;
}

export function useDocuments(): UseDocumentsReturn {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/auth/login');
            throw new Error('No authentication token found');
        }
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    const handleAuthError = (status: number) => {
        if (status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    };

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('access_token');
            // If no token, don't fetch and let ProtectedRoute handle redirect
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${apiUrl}/documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleAuthError(401);
                return;
            }

            if (!response.ok) {
                throw new Error(`Error fetching documents: ${response.status}`);
            }

            const data: Document[] = await response.json();

            // Sort by created_at DESC (most recent first)
            const sortedData = data.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setDocuments(sortedData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, router]);

    const updateDocument = async (id: string, data: UpdateDocumentDto) => {
        try {
            const headers = getAuthHeaders();
            const response = await fetch(`${apiUrl}/documents/${id}`, {
                method: 'PATCH',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                handleAuthError(401);
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`Error updating document: ${response.status}`);
            }

            // Refetch documents after update
            await fetchDocuments();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error updating document:', err);
            throw new Error(errorMessage);
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            const headers = getAuthHeaders();
            const response = await fetch(`${apiUrl}/documents/${id}`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.status === 401) {
                handleAuthError(401);
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                throw new Error(`Error deleting document: ${response.status}`);
            }

            // Refetch documents after delete
            await fetchDocuments();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error deleting document:', err);
            throw new Error(errorMessage);
        }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);

        try {
            const headers = getAuthHeaders();
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${apiUrl}/documents/upload`, {
                method: 'POST',
                headers: headers, // Only auth header, NO Content-Type for FormData
                body: formData,
            });

            if (response.status === 401) {
                handleAuthError(401);
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error uploading file: ${response.status} - ${errorText}`);
            }

            // Refetch documents after successful upload
            await fetchDocuments();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error uploading file:', err);
            throw new Error(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        loading,
        uploading,
        error,
        refetch: fetchDocuments,
        updateDocument,
        deleteDocument,
        uploadFile,
    };
}
