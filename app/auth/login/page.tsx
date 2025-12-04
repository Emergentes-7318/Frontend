"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { useAuth } from '@/app/context/AuthContext';
import { LoginDto, AuthResponse } from '@/app/types/auth';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const toast = React.useRef<Toast>(null);

    const [formData, setFormData] = useState<LoginDto>({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Ensure API URL doesn't have a trailing slash
        const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        const endpoint = `${baseUrl}/auth/login`;

        console.log('Attempting login to:', endpoint);
        console.log('Payload:', JSON.stringify(formData));

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log('Response status:', response.status);

            if (response.status === 200 || response.status === 201) {
                const data: AuthResponse = await response.json();

                // Save to context and localStorage
                login(data);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Bienvenido',
                    detail: `Hola ${data.user.username}!`,
                    life: 2000
                });

                setTimeout(() => {
                    router.push('/home/dashboard');
                }, 1500);
            } else if (response.status === 401) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Credenciales inválidas',
                    life: 3000
                });
            } else {
                const errorData = await response.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorData.message || 'Error al iniciar sesión',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo conectar con el servidor',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Toast ref={toast} />

            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                        <i className="pi pi-file text-3xl text-white"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-2">DocMind</h1>
                    <p className="text-gray-600">Inicia sesión en tu cuenta</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon bg-blue-50">
                                    <i className="pi pi-envelope text-blue-600"></i>
                                </span>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <i className="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10"></i>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Tu contraseña"
                                    toggleMask
                                    feedback={false}
                                    required
                                    className="w-full"
                                    inputClassName="w-full pl-10 p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    inputId="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.checked || false)}
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                    Recordarme
                                </label>
                            </div>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="button"
                            label="Iniciar sesión"
                            icon="pi pi-sign-in"
                            loading={loading}
                            onClick={handleSubmit}
                            className="w-full p-button-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                        />
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/register')}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>© 2024 DocMind. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
}
