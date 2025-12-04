"use client";
import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { useDocuments } from "@/app/hooks/useDocuments";
import { useRouter } from "next/navigation";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function DashboardPage() {
    const router = useRouter();
    const { documents, loading } = useDocuments();

    // Calcular documentos por usuario
    const documentsByUser = useMemo(() => {
        const userCounts: { [key: string]: number } = {};
        documents.forEach(doc => {
            userCounts[doc.user_id] = (userCounts[doc.user_id] || 0) + 1;
        });
        return userCounts;
    }, [documents]);

    // Preparar datos para el gráfico de barras
    const chartData = useMemo(() => {
        const users = Object.keys(documentsByUser);
        const counts = Object.values(documentsByUser);

        return {
            labels: users,
            datasets: [
                {
                    label: 'Documentos subidos',
                    data: counts,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)',
                        'rgb(236, 72, 153)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        };
    }, [documentsByUser]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    // Obtener últimos 5 documentos
    const recentDocuments = useMemo(() => {
        return [...documents]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    }, [documents]);

    // Temáticas (maqueta con datos simulados)
    const topics = [
        { name: 'Entretenimiento', count: Math.floor(documents.length * 0.35), color: 'success', icon: 'pi-star' },
        { name: 'Tecnología', count: Math.floor(documents.length * 0.40), color: 'info', icon: 'pi-desktop' },
        { name: 'Finanzas', count: Math.floor(documents.length * 0.25), color: 'warning', icon: 'pi-dollar' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <i className="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-blue-950 mb-2">Dashboard</h1>
                <p className="text-gray-600">Resumen de tus documentos y estadísticas</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Gráfico de barras - Documentos por usuario */}
                <Card className="shadow-lg border border-gray-100">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-chart-bar text-2xl text-blue-600"></i>
                            <h3 className="text-xl font-bold text-blue-950">Documentos por Usuario</h3>
                        </div>
                        <p className="text-sm text-gray-500">Cantidad de documentos subidos</p>
                    </div>

                    <div style={{ height: '300px' }}>
                        {Object.keys(documentsByUser).length > 0 ? (
                            <Chart type="bar" data={chartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400">No hay datos disponibles</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
                            <p className="text-xs text-gray-500">Total de documentos</p>
                        </div>
                    </div>
                </Card>

                {/* Card 2: Últimos documentos */}
                <Card className="shadow-lg border border-gray-100">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-clock text-2xl text-green-600"></i>
                            <h3 className="text-xl font-bold text-blue-950">Documentos Recientes</h3>
                        </div>
                        <p className="text-sm text-gray-500">Últimos 5 documentos subidos</p>
                    </div>

                    <div className="space-y-3">
                        {recentDocuments.length > 0 ? (
                            recentDocuments.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer border border-gray-100"
                                    onClick={() => router.push(`/home/chats/${doc.id}`)}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate text-sm">
                                            {doc.filename}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(doc.created_at).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <i className="pi pi-arrow-right text-gray-400 text-sm"></i>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <i className="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p className="text-gray-400 text-sm">No hay documentos</p>
                            </div>
                        )}
                    </div>

                    {recentDocuments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                            <button
                                onClick={() => router.push('/home/documents')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Ver todos los documentos →
                            </button>
                        </div>
                    )}
                </Card>

                {/* Card 3: Temáticas principales */}
                <Card className="shadow-lg border border-gray-100">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-tags text-2xl text-purple-600"></i>
                            <h3 className="text-xl font-bold text-blue-950">Temáticas Principales</h3>
                        </div>
                        <p className="text-sm text-gray-500">Categorías de documentos</p>
                    </div>

                    <div className="space-y-4">
                        {topics.map((topic, index) => (
                            <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-${topic.color === 'success' ? 'green' : topic.color === 'info' ? 'blue' : 'yellow'}-100 flex items-center justify-center`}>
                                            <i className={`pi ${topic.icon} text-${topic.color === 'success' ? 'green' : topic.color === 'info' ? 'blue' : 'yellow'}-600`}></i>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{topic.name}</p>
                                            <p className="text-xs text-gray-500">{topic.count} documentos</p>
                                        </div>
                                    </div>
                                    <Tag
                                        value={`${Math.round((topic.count / documents.length) * 100)}%`}
                                        severity={topic.color as any}
                                        rounded
                                    />
                                </div>

                                {/* Barra de progreso */}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`bg-${topic.color === 'success' ? 'green' : topic.color === 'info' ? 'blue' : 'yellow'}-500 h-2 rounded-full transition-all`}
                                        style={{ width: `${(topic.count / documents.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-blue-600 font-medium">
                                <i className="pi pi-info-circle mr-1"></i>
                                Datos de temáticas generados automáticamente
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
