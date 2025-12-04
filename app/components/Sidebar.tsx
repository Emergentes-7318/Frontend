"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const sidebarItems = [
        { label: "Dashboard", path: "/home/dashboard", icon: "pi-home", adminOnly: false },
        { label: "Documentos", path: "/home/documents", icon: "pi-file", adminOnly: false },
        { label: "Chats", path: "/home/chats", icon: "pi-comments", adminOnly: false },
        { label: "Usuarios", path: "/home/users", icon: "pi-users", adminOnly: true },
        { label: "Configuración", path: "/home/config", icon: "pi-cog", adminOnly: false },
    ];

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen bg-white shadow-lg p-4 z-50 transition-all duration-300 flex flex-col
                ${collapsed ? 'w-16' : 'w-64'}
            `}>
                {/* Toggle button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 bg-blue-900 text-white rounded-full p-2 shadow-lg hover:bg-blue-800 transition-colors"
                >
                    <i className={`pi ${collapsed ? 'pi-angle-right' : 'pi-angle-left'}`} />
                </button>

                {/* User info */}
                {!collapsed && user && (
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{user.username}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                {user.role === 'admin' && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-2 mt-8">
                    {sidebarItems
                        .filter(item => !item.adminOnly || (user && user.role === 'admin'))
                        .map((item, index) => {
                            const isActive = pathname === item.path;

                            return (
                                <Link
                                    key={index}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                        ${isActive ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"}
                                        ${collapsed ? 'justify-center' : ''}
                                    `}
                                    title={collapsed ? item.label : ''}
                                >
                                    <i className={`pi ${item.icon}`} style={{ fontSize: "1.5rem" }} />
                                    {!collapsed && <span className="text-lg">{item.label}</span>}
                                </Link>
                            );
                        })}
                </nav>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-red-600 hover:bg-red-50 mt-auto
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? 'Cerrar sesión' : ''}
                >
                    <i className="pi pi-sign-out" style={{ fontSize: "1.5rem" }} />
                    {!collapsed && <span className="text-lg">Cerrar sesión</span>}
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
