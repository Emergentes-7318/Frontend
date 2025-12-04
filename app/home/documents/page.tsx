
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
import DrivePicker from "@/app/components/DrivePicker";
import { useDocuments } from "@/app/hooks/useDocuments";
import { useUsers } from "@/app/hooks/useUsers";
import { useAuth } from "@/app/context/AuthContext";
import { Document } from "@/app/types/document";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

function DocumentPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { documents, loading, uploading, error, refetch, updateDocument, deleteDocument, uploadFile } = useDocuments();
    const { getUsernameById } = useUsers();

    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [editFilename, setEditFilename] = useState("");
    const [editUserId, setEditUserId] = useState("");
    const toast = React.useRef<Toast>(null);

    const handleQuickView = (doc: Document) => {
        setSelectedDocument(doc);
        setViewerVisible(true);
    };

    const handleOpenWithAI = (doc: Document) => {
        // Navegar a la página de análisis con IA
        router.push(`/home/documents/${doc.id}/analyze`);
    };

    const handleUpload = async (event: FileUploadHandlerEvent) => {
        const files = event.files;

        if (files.length === 0) return;

        try {
            // Upload files one by one
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                toast.current?.show({
                    severity: 'info',
                    summary: 'Subiendo',
                    detail: `Subiendo ${file.name} (${i + 1}/${files.length})...`,
                    life: 2000
                });

                await uploadFile(file);
            }

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
                detail: error instanceof Error ? error.message : 'Hubo un problema al subir los archivos',
                life: 3000
            });
        }
    };

    const handleEdit = (doc: Document) => {
        setEditingDocument(doc);
        setEditFilename(doc.filename);
        setEditUserId(doc.user_id);
        setEditDialogVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!editingDocument) return;

        try {
            await updateDocument(editingDocument.id, {
                filename: editFilename,
                user_id: editUserId,
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Documento actualizado correctamente',
                life: 3000
            });

            setEditDialogVisible(false);
            setEditingDocument(null);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el documento',
                life: 3000
            });
        }
    };

    const handleDelete = (doc: Document) => {
        confirmDialog({
            message: `¿Estás seguro de que deseas eliminar "${doc.filename}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await deleteDocument(doc.id);

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Documento eliminado correctamente',
                        life: 3000
                    });
                } catch (error) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo eliminar el documento',
                        life: 3000
                    });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData: Document) => {
        return (
            <div className="flex gap-2">
                {/* Editar */}
                <Button
                    icon="pi pi-pencil"
                    className="p-button-sm p-button-rounded p-button-text"
                    tooltip="Editar"
                    onClick={() => handleEdit(rowData)}
                />
                {/* Eliminar */}
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-rounded p-button-text p-button-danger"
                    tooltip="Eliminar"
                    onClick={() => handleDelete(rowData)}
                />
                {/* Analizar (sin lógica por ahora) */}
                <Button
                    label="Analizar"
                    className="p-button-sm p-button-rounded p-button-info"
                    onClick={() => handleOpenWithAI(rowData)}
                />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Document) => {
        return new Date(rowData.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const userBodyTemplate = (rowData: Document) => {
        const username = getUsernameById(rowData.user_id);
        const isCurrentUser = user && user.id === rowData.user_id;

        if (isCurrentUser) {
            return (
                <div className="flex items-center gap-2">
                    <Tag value={username} severity="info" />
                </div>
            );
        }
        // Show username for other users
        return (
            <span className="text-gray-600 text-sm">
                {username}
            </span>
        );
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <Toast ref={toast} />
            <ConfirmDialog />

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
                    <DrivePicker />
                    <Button label="Crear carpeta" icon="pi pi-folder" className="p-button-outlined" />
                </div>
            </div>

            {/* Document Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-blue-950 mb-4">Documentos recientes ({documents.length})</h3>

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

                {!loading && !error && (
                    <DataTable value={documents} className="p-datatable-sm" stripedRows>
                        <Column field="filename" header="Nombre del documento" />
                        <Column body={dateBodyTemplate} header="Fecha de subida" />
                        <Column body={userBodyTemplate} header="Subido por" />
                        <Column body={actionBodyTemplate} header="Acciones" style={{ width: '250px' }} />
                    </DataTable>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog
                header="Editar Documento"
                visible={editDialogVisible}
                style={{ width: '450px' }}
                onHide={() => setEditDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setEditDialogVisible(false)} className="p-button-text" />
                        <Button label="Guardar" icon="pi pi-check" onClick={handleSaveEdit} autoFocus />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="filename" className="block mb-2 font-semibold">Nombre del archivo</label>
                        <InputText
                            id="filename"
                            value={editFilename}
                            onChange={(e) => setEditFilename(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="userId" className="block mb-2 font-semibold">Usuario</label>
                        <InputText
                            id="userId"
                            value={editUserId}
                            onChange={(e) => setEditUserId(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>

            {/* Document Viewer (Vista rápida en popup) */}
            <DocumentViewer
                visible={viewerVisible}
                onHide={() => setViewerVisible(false)}
                documentUrl={selectedDocument?.s3_url || null}
                documentName={selectedDocument?.filename || ""}
            />
        </div>
    );
}

export default DocumentPage;