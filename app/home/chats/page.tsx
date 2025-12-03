"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDocuments } from "@/app/hooks/useDocuments";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function ChatsListPage() {
    const router = useRouter();
    const { documents, loading, error } = useDocuments();
    const toast = React.useRef<Toast>(null);

    return (
        <div className="p-4 flex flex-col gap-6">
            <Toast ref={toast} />

            <div>
                <h2 className="text-2xl font-bold text-blue-950 mb-1">Mis Chats</h2>
                <p className="text-gray-600 mb-6">
                    Selecciona un documento para chatear con IA
                </p>
            </div>

            {/* Document Cards */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-blue-950 mb-4">Documentos disponibles ({documents.length})</h3>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800">
                            <i className="pi pi-exclamation-circle mr-2"></i>
                            Error al cargar documentos: {error}
                        </p>
                    </div>
                )}

                {!loading && !error && documents.length === 0 && (
                    <div className="text-center py-12">
                        <i className="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">No hay documentos todavía</p>
                        <p className="text-sm text-gray-400 mt-2">Sube documentos desde la sección "Documentos"</p>
                        <Button
                            label="Ir a Documentos"
                            icon="pi pi-file"
                            className="mt-4"
                            onClick={() => router.push('/home/documents')}
                        />
                    </div>
                )}

                {!loading && !error && documents.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="group border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer bg-white"
                                onClick={() => router.push(`/home/chats/${doc.id}`)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: Document Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <i className="pi pi-comments text-purple-500 text-2xl"></i>
                                            <h4 className="text-lg font-bold text-blue-950 group-hover:text-purple-600 transition-colors">
                                                {doc.filename}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate mb-2">
                                            <i className="pi pi-link text-xs mr-1"></i>
                                            {doc.s3_url}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>
                                                <i className="pi pi-calendar mr-1"></i>
                                                {new Date(doc.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: User Badge */}
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                            <i className="pi pi-user text-xs mr-1"></i>
                                            {doc.user_id}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            <i className="pi pi-arrow-right mr-1"></i>
                                            Click para chatear
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}