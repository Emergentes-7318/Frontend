"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const sidebarItems = [
        { label: "Dashboard", path: "/home/dashboard", icon: "pi-home" },
        { label: "Documentos", path: "/home/documents", icon: "pi-file" },
        { label: "Chats", path: "/home/chats", icon: "pi-comments" },
        { label: "Reportes", path: "/home/reports", icon: "pi-chart-bar" },
        { label: "Configuración", path: "/home/config", icon: "pi-cog" },
    ];

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
                fixed top-0 left-0 h-screen bg-white shadow-lg p-4 z-50 transition-all duration-300
                ${collapsed ? 'w-16' : 'w-64'}
            `}>
                {/* Toggle button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 bg-blue-900 text-white rounded-full p-2 shadow-lg hover:bg-blue-800 transition-colors"
                >
                    <i className={`pi ${collapsed ? 'pi-angle-right' : 'pi-angle-left'}`} />
                </button>

                <nav className="flex flex-col gap-2 mt-8">
                    {sidebarItems.map((item, index) => {
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
            </aside>
        </>
    );
};

export default Sidebar;
