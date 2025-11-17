"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const sidebarItems = [
        { label: "Dashboard", path: "/dashboard", icon: "pi-home" },
        { label: "Documentos", path: "/documents", icon: "pi-file" },
        { label: "Chats", path: "/chats", icon: "pi-comments" },
        { label: "Reportes", path: "/reports", icon: "pi-chart-bar" }, // <-- corregido
        { label: "Configuración", path: "/config", icon: "pi-cog" },
    ];

    return (
        <aside className="w-64 bg-white h-screen shadow-lg p-4">
            <nav className="flex flex-col gap-2">
                {sidebarItems.map((item, index) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={index}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-all
                                ${isActive ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"}
                            `}
                        >
                            <i className={`pi ${item.icon}`} style={{ fontSize: "1.5rem" }} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
