"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { RegisterDto } from '@/app/types/auth';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function RegisterPage() {
    const router = useRouter();
    const toast = React.useRef<Toast>(null);

    const [formData, setFormData] = useState<RegisterDto>({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 201) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: 'Tu cuenta ha sido creada. Redirigiendo al login...',
                    life: 3000
                });

                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else if (response.status === 409) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'El usuario o email ya existe',
                    life: 3000
                });
            } else {
                const errorData = await response.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorData.message || 'Error al registrar usuario',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
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
                    <p className="text-gray-600">Crea tu cuenta para comenzar</p>
                </div>

                {/* Register Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre de usuario
                            </label>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon bg-blue-50">
                                    <i className="pi pi-user text-blue-600"></i>
                                </span>
                                <InputText
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Tu nombre de usuario"
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>

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
                                    placeholder="Mínimo 6 caracteres"
                                    toggleMask
                                    feedback={false}
                                    required
                                    className="w-full"
                                    inputClassName="w-full pl-10 p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            label="Crear cuenta"
                            icon="pi pi-user-plus"
                            loading={loading}
                            className="w-full p-button-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                        />
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Inicia sesión
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
