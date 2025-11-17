
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { DocumentViewer } from "@/app/components/DocumentViewer";
import { Toast } from "primereact/toast";

interface Document {
    id: string;
    name: string;
    date: string;
    uploadedBy: string;
    pages: number;
    status: string;
    url?: string;
}

function DocumentPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([
        { id: '1', name: "Contrato_Servicio_2024.pdf", date: "2024-10-25", uploadedBy: "María González", pages: 12, status: "Analizado", url: "/sample.pdf" },
        { id: '2', name: "Informe_Financiero_Q3.pdf", date: "2024-10-24", uploadedBy: "Carlos Ruiz", pages: 45, status: "Procesando" },
        { id: '3', name: "Propuesta_Comercial.pdf", date: "2024-10-23", uploadedBy: "Juan Pérez", pages: 8, status: "Analizado" },
        { id: '4', name: "Manual_Usuario_v2.pdf", date: "2024-10-22", uploadedBy: "Ana López", pages: 67, status: "Pendiente" },
    ]);

    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const toast = React.useRef<Toast>(null);

    const statusBodyTemplate = (rowData: Document) => {
        let severity: 'success' | 'info' | 'warning' = 'info';
        if (rowData.status === "Analizado") severity = "success";
        else if (rowData.status === "Procesando") severity = "info";
        else if (rowData.status === "Pendiente") severity = "warning";

        return <Tag value={rowData.status} severity={severity} />;
    };

    const actionBodyTemplate = (rowData: Document) => {
        return (
            <div className="flex gap-2">
                {/* Vista rápida en popup */}
                <Button
                    icon="pi pi-eye"
                    className="p-button-sm p-button-rounded p-button-text"
                    tooltip="Vista rápida"
                    onClick={() => handleQuickView(rowData)}
                    disabled={!rowData.url}
                />
                {/* Abrir en página completa con IA */}
                <Button
                    icon="pi pi-external-link"
                    className="p-button-sm p-button-rounded p-button-text"
                    tooltip="Abrir con IA"
                    onClick={() => handleOpenWithAI(rowData)}
                    disabled={!rowData.url}
                />
                <Button
                    label="Analizar"
                    className="p-button-sm p-button-rounded p-button-info"
                    onClick={() => handleOpenWithAI(rowData)}
                />
            </div>
        );
    };

    const handleQuickView = (doc: Document) => {
        setSelectedDocument(doc);
        setViewerVisible(true);
    };

    const handleOpenWithAI = (doc: Document) => {
        // Navegar a la página de visualización con IA
        router.push(`/home/documents/${doc.id}`);
    };

    const handleUpload = (event: FileUploadHandlerEvent) => {
        const files = event.files;

        try {
            const newDocs: Document[] = files.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);

                return {
                    id: (Date.now() + index).toString(),
                    name: file.name,
                    date: new Date().toISOString().split('T')[0],
                    uploadedBy: "Usuario Actual",
                    pages: 0,
                    status: "Pendiente",
                    url: fileUrl
                };
            });

            setDocuments(prev => [...newDocs, ...prev]);

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `${files.length} archivo(s) subido(s) correctamente`,
                life: 3000
            });

            event.options.clear();

        } catch (error) {
            console.error("Error al subir archivos:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al subir los archivos',
                life: 3000
            });
        }
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <Toast ref={toast} />

            <div>
                <h2 className="text-2xl font-bold text-blue-950 mb-1">Mis Documentos</h2>
                <p className="text-gray-600 mb-6">
                    Sube, organiza y analiza tus documentos con IA
                </p>
            </div>

            {/* Upload Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center shadow-sm">
                <FileUpload
                    name="demo[]"
                    customUpload
                    uploadHandler={handleUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
                    maxFileSize={50000000}
                    chooseLabel="Seleccionar archivos"
                    uploadLabel="Subir"
                    cancelLabel="Cancelar"
                    className="w-full md:w-1/2"
                    emptyTemplate={
                        <div className="flex flex-col items-center gap-3 py-5">
                            <i className="pi pi-cloud-upload text-4xl text-gray-400"></i>
                            <p className="text-gray-600">Arrastra archivos aquí o haz clic para subir</p>
                            <p className="text-sm text-gray-400">PDF, DOC, DOCX, XLS, XLSX, TXT, imágenes (Máx. 50MB)</p>
                        </div>
                    }
                    multiple
                    auto={false}
                />
                <div className="flex gap-3 mt-5">
                    <Button label="Conectar Google Drive" icon="pi pi-google" className="p-button-outlined" />
                    <Button label="Crear carpeta" icon="pi pi-folder" className="p-button-outlined" />
                </div>
            </div>

            {/* Document Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-blue-950 mb-4">Documentos recientes ({documents.length})</h3>
                <DataTable value={documents} className="p-datatable-sm" stripedRows>
                    <Column field="name" header="Nombre del documento" />
                    <Column field="date" header="Fecha de subida" />
                    <Column field="uploadedBy" header="Subido por" />
                    <Column field="pages" header="Páginas" />
                    <Column body={statusBodyTemplate} header="Estado" />
                    <Column body={actionBodyTemplate} header="Acciones" style={{ width: '250px' }} />
                </DataTable>
            </div>

            {/* Document Viewer (Vista rápida en popup) */}
            <DocumentViewer
                visible={viewerVisible}
                onHide={() => setViewerVisible(false)}
                documentUrl={selectedDocument?.url || null}
                documentName={selectedDocument?.name || ""}
            />
        </div>
    );
}

export default DocumentPage;