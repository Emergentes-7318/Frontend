'use client';

import { useEffect, useRef } from 'react';
import useDrivePicker from 'react-google-drive-picker';

interface PickerCallbackData {
    action: string;
    docs: Array<{ id: string; name: string;[key: string]: unknown }>;
    oauthToken?: string;
    accessToken?: string;
    token?: string;
}

export default function DrivePicker() {
    const [openPicker, authResponse] = useDrivePicker();
    const authResponseRef = useRef<any>(null);

    // Actualizar el ref cuando authResponse cambie
    useEffect(() => {
        if (authResponse) {
            authResponseRef.current = authResponse;
            console.log('🔐 [HOOK] authResponse actualizado y guardado en ref:', authResponse);
        }
    }, [authResponse]);

    const handleUpload = async (fileId: string, oauthToken: string) => {
        console.log('🚀 [handleUpload] Iniciando subida...');
        console.log('   - File ID:', fileId);
        console.log('   - Token:', oauthToken ? 'PRESENTE (Oculto)' : 'FALTANTE');

        try {
            // Get JWT token for backend authentication
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                alert('⚠️ Sesión expirada. Por favor inicia sesión de nuevo.');
                window.location.href = '/auth/login';
                return;
            }

            // OJO: Ajustado a puerto 4000 por si el .env falla, ya que moviste el backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            console.log('📡 Conectando al Backend en:', `${apiUrl}/documents/upload-drive`);

            const response = await fetch(`${apiUrl}/documents/upload-drive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    fileId,
                    accessToken: oauthToken
                }),
            });

            console.log('📥 Respuesta del servidor status:', response.status);

            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                alert('⚠️ Sesión expirada. Por favor inicia sesión de nuevo.');
                window.location.href = '/auth/login';
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error Backend (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ [ÉXITO] Respuesta data:', data);
            alert('✅ Archivo procesado y subido con éxito');

        } catch (error) {
            console.error('❌ [ERROR] Falló la subida:', error);
            alert('Ocurrió un error al subir. Revisa la consola (F12).');
        }
    };

    const handleOpenPicker = () => {
        console.log('🔌 [DrivePicker] Abriendo ventana de Google...');
        console.log('   - authResponse actual (State):', authResponse);
        console.log('   - authResponse actual (Ref):', authResponseRef.current);

        // Usamos tus claves HARDCODEADAS para descartar problemas de .env por ahora
        const CLIENT_ID = "194772691428-dfrivvdignk3enn2bjl4h1idcpmq9dmb.apps.googleusercontent.com";
        const API_KEY = "AIzaSyDdQl1favc83zj-1BxtB6zltX2ROoL66RM";

        openPicker({
            clientId: CLIENT_ID,
            developerKey: API_KEY,
            viewId: 'DOCS',
            viewMimeTypes: 'application/pdf',
            setIncludeFolders: true,
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,

            // 🔥 ESTO ES LO QUE FALTABA: Permisos para leer el archivo
            customScopes: ['https://www.googleapis.com/auth/drive.file'],

            callbackFunction: (data: PickerCallbackData) => {
                console.log('📦 [CALLBACK] Datos crudos recibidos:', data);
                console.log('🔑 Keys en data:', Object.keys(data));

                if (data.action === 'cancel') {
                    console.log('🚫 Usuario canceló la selección');
                }
                else if (data.action === 'picked') {
                    console.log('🎯 Usuario seleccionó un archivo.');
                    const file = data.docs[0];

                    // INTENTO DE RECUPERACIÓN DE TOKEN ROBUSTO
                    // 1. Intentar propiedad estándar
                    let token = data.oauthToken;

                    // 2. Intentar otras propiedades comunes
                    if (!token) {
                        console.warn('⚠️ data.oauthToken está vacío. Buscando alternativas...');
                        // @ts-ignore
                        token = data.accessToken || data.token;
                    }

                    // 3. Intentar obtenerlo del hook authResponse (USANDO REF para evitar stale closure)
                    if (!token && authResponseRef.current && authResponseRef.current.access_token) {
                        console.warn('⚠️ Usando token de authResponse (Ref)...');
                        token = authResponseRef.current.access_token;
                    }

                    // 4. Intentar obtenerlo de gapi global (si existe)
                    if (!token && typeof window !== 'undefined' && (window as any).gapi?.client?.getToken) {
                        console.warn('⚠️ Token no encontrado en data ni authResponse. Intentando gapi.client.getToken()...');
                        const gapiToken = (window as any).gapi.client.getToken();
                        if (gapiToken) {
                            token = gapiToken.access_token;
                        }
                    }

                    if (file && token) {
                        console.log('   - Archivo:', file.name);
                        console.log('   - ID:', file.id);
                        console.log('   - Token recuperado:', token ? 'SÍ' : 'NO');
                        handleUpload(file.id, token);
                    } else {
                        console.error('❌ ERROR CRÍTICO: Google no devolvió file o token.');
                        console.error('   - File:', file);
                        console.error('   - Token:', token);
                        console.error('   - authResponse (Ref):', authResponseRef.current);
                        alert('Error: No se recibieron permisos de lectura del archivo (Token faltante).');
                    }
                }
                else {
                    console.log(`ℹ️ Acción recibida: ${data.action}`);
                }
            },
        });
    };

    return (
        <button
            onClick={handleOpenPicker}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
        >
            <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
            </svg>
            Importar desde Drive
        </button>
    );
}
