"use client";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function ConfigPage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const toast = React.useRef<Toast>(null);

    // Profile state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const languageOptions = [
        { label: 'Español', value: 'es', icon: '🇪🇸' },
        { label: 'English', value: 'en', icon: '🇺🇸' }
    ];

    // Load user data
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    // Handle dark mode toggle
    const handleDarkModeToggle = (value: boolean) => {
        setDarkMode(value);
        localStorage.setItem('darkMode', value.toString());

        toast.current?.show({
            severity: 'info',
            summary: 'Modo oscuro',
            detail: value ? 'Modo oscuro activado' : 'Modo oscuro desactivado',
            life: 2000
        });
    };

    // Handle language change
    const handleLanguageChange = (value: string) => {
        setLanguage(value as 'es' | 'en');
        localStorage.setItem('language', value);

        toast.current?.show({
            severity: 'success',
            summary: 'Idioma actualizado',
            detail: `Idioma cambiado a ${languageOptions.find(l => l.value === value)?.label}`,
            life: 2000
        });
    };

    // Handle profile update
    const handleUpdateProfile = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${apiUrl}/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    email
                })
            });

            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                router.push('/auth/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Error al actualizar perfil');
            }

            // Update user in localStorage
            const updatedUser = { ...user, username, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.current?.show({
                severity: 'success',
                summary: 'Perfil actualizado',
                detail: 'Tus datos han sido actualizados correctamente',
                life: 3000
            });

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el perfil',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const languageTemplate = (option: any) => {
        return (
            <div className="flex items-center gap-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
            </div>
        );
    };

    return (
        <div className="p-6">
            <Toast ref={toast} />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-blue-950 mb-2">Configuración</h1>
                <p className="text-gray-600">Gestiona tu cuenta y preferencias del sistema</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <i className="pi pi-user text-2xl text-white"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-blue-950">Información del Perfil</h2>
                                <p className="text-sm text-gray-500">Actualiza tu información personal</p>
                            </div>
                        </div>

                        <div className="space-y-4">
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
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full"
                                        placeholder="Tu nombre de usuario"
                                    />
                                </div>
                            </div>

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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <Button
                                    label="Guardar cambios"
                                    icon="pi pi-check"
                                    onClick={handleUpdateProfile}
                                    loading={loading}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <i className="pi pi-cog text-2xl text-white"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-blue-950">Preferencias</h2>
                                <p className="text-sm text-gray-500">Personaliza tu experiencia</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Dark Mode */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="pi pi-moon text-2xl text-indigo-600"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Modo oscuro</p>
                                        <p className="text-xs text-gray-500">Cambia entre tema claro y oscuro</p>
                                    </div>
                                </div>
                                <InputSwitch
                                    checked={darkMode}
                                    onChange={(e) => handleDarkModeToggle(e.value)}
                                />
                            </div>

                            {/* Language */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <i className="pi pi-globe text-2xl text-green-600"></i>
                                    <div>
                                        <p className="font-semibold text-gray-800">Idioma</p>
                                        <p className="text-xs text-gray-500">Selecciona tu idioma preferido</p>
                                    </div>
                                </div>
                                <Dropdown
                                    value={language}
                                    options={languageOptions}
                                    onChange={(e) => handleLanguageChange(e.value)}
                                    itemTemplate={languageTemplate}
                                    valueTemplate={languageTemplate}
                                    className="w-full"
                                    placeholder="Selecciona un idioma"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Integrations Section */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                                <i className="pi pi-link text-2xl text-white"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-blue-950">Integraciones</h2>
                                <p className="text-sm text-gray-500">Conecta servicios externos</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-700 font-bold text-lg">G</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Google Drive</p>
                                        <p className="text-xs text-gray-500">Importa documentos desde Drive</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                        Conectado
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <i className="pi pi-key text-gray-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">API Key</p>
                                        <p className="text-xs text-gray-500">Integración con sistemas externos</p>
                                    </div>
                                </div>
                                <Button
                                    label="Generar"
                                    icon="pi pi-plus"
                                    className="p-button-outlined p-button-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Account Info & Actions */}
                <div className="space-y-6">
                    {/* Account Info */}
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                                {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{user?.username}</p>
                                <p className="text-sm text-white/80">{user?.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/80">Rol</span>
                                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                                    {user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="pi pi-shield text-2xl text-red-600"></i>
                            <h3 className="font-bold text-gray-800">Seguridad</h3>
                        </div>

                        <div className="space-y-3">
                            <Button
                                label="Cambiar contraseña"
                                icon="pi pi-lock"
                                className="w-full p-button-outlined"
                            />
                            <Button
                                label="Cerrar sesión"
                                icon="pi pi-sign-out"
                                onClick={() => {
                                    logout();
                                    router.push('/auth/login');
                                }}
                                className="w-full p-button-danger p-button-outlined"
                            />
                        </div>
                    </div>

                    {/* Plan Info */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <i className="pi pi-star text-2xl text-yellow-500"></i>
                            <h3 className="font-bold text-gray-800">Plan Actual</h3>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm font-semibold text-orange-800 mb-1">Plan Profesional</p>
                            <p className="text-2xl font-bold text-orange-900 mb-3">€49/mes</p>
                            <ul className="text-xs text-orange-800 space-y-1 mb-4">
                                <li className="flex items-center gap-2">
                                    <i className="pi pi-check text-green-600"></i>
                                    500 documentos/mes
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="pi pi-check text-green-600"></i>
                                    IA ilimitada
                                </li>
                                <li className="flex items-center gap-2">
                                    <i className="pi pi-check text-green-600"></i>
                                    Integraciones
                                </li>
                            </ul>
                            <Button
                                label="Mejorar plan"
                                icon="pi pi-arrow-up"
                                className="w-full p-button-sm bg-gradient-to-r from-yellow-500 to-orange-500 border-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
