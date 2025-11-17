
"use client";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface DocumentViewerProps {
    visible: boolean;
    onHide: () => void;
    documentUrl: string | null;
    documentName: string;
}

export function DocumentViewer({ visible, onHide, documentUrl, documentName }: DocumentViewerProps) {
    const [zoom, setZoom] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleResetZoom = () => setZoom(100);

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase();
    };

    const renderDocumentContent = () => {
        if (!documentUrl) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No se puede cargar el documento</p>
                </div>
            );
        }

        const extension = getFileExtension(documentName);

        // Para PDFs (usaremos iframe por ahora)
        if (extension === 'pdf') {
            return (
                <div className="w-full h-full overflow-auto bg-gray-100">
                    <iframe
                        src={documentUrl}
                        className="w-full h-full border-0"
                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                        title={documentName}
                    />
                </div>
            );
        }

        // Para imágenes
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
            return (
                <div className="w-full h-full overflow-auto bg-gray-100 flex items-center justify-center">
                    <img
                        src={documentUrl}
                        alt={documentName}
                        style={{ transform: `scale(${zoom / 100})` }}
                        className="max-w-none"
                    />
                </div>
            );
        }

        // Para archivos de texto
        if (['txt', 'md', 'json', 'xml'].includes(extension || '')) {
            return (
                <div className="w-full h-full overflow-auto bg-white p-6">
                    <iframe
                        src={documentUrl}
                        className="w-full h-full border-0"
                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                        title={documentName}
                    />
                </div>
            );
        }

        // Para otros tipos de archivos
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <i className="pi pi-file text-6xl text-gray-400"></i>
                <p className="text-gray-600">Vista previa no disponible para este tipo de archivo</p>
                <a
                    href={documentUrl}
                    download={documentName}
                    className="text-blue-600 hover:underline flex items-center gap-2"
                >
                    <i className="pi pi-download"></i>
                    Descargar archivo
                </a>
            </div>
        );
    };

    const headerTemplate = (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <i className="pi pi-file text-xl text-blue-900"></i>
                <span className="font-semibold text-blue-950">{documentName}</span>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    icon="pi pi-search-minus"
                    onClick={handleZoomOut}
                    className="p-button-text p-button-sm"
                    tooltip="Alejar"
                    disabled={zoom <= 50}
                />
                <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
                <Button
                    icon="pi pi-search-plus"
                    onClick={handleZoomIn}
                    className="p-button-text p-button-sm"
                    tooltip="Acercar"
                    disabled={zoom >= 200}
                />
                <Button
                    icon="pi pi-refresh"
                    onClick={handleResetZoom}
                    className="p-button-text p-button-sm"
                    tooltip="Restablecer zoom"
                />
                {documentUrl && (
                    <a href={documentUrl} download={documentName}>
                        <Button
                            icon="pi pi-download"
                            className="p-button-text p-button-sm"
                            tooltip="Descargar"
                        />
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={headerTemplate}
            style={{ width: '90vw', height: '90vh' }}
            contentStyle={{ height: 'calc(100% - 60px)', padding: 0 }}
            maximizable
            modal
        >
            <div className="h-full w-full relative">
                {renderDocumentContent()}
            </div>
        </Dialog>
    );
}