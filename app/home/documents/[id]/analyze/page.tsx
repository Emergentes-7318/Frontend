"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface AnalysisResult {
    respuesta: string;
    filename: string;
    id: string;
}

export default function DocumentAnalyzePage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.id as string;

    const [document, setDocument] = useState<any>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = React.useRef<Toast>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Fetch document details only
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`${apiUrl}/documents/${documentId}`);

                if (!response.ok) {
                    throw new Error('Error al cargar el documento');
                }

                const data = await response.json();
                setDocument(data);
            } catch (err) {
                console.error('Error fetching document:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el documento',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        if (documentId) {
            fetchDocument();
        }
    }, [documentId, apiUrl]);

    // Manual analysis trigger
    const handleAnalyze = async () => {
        setAnalyzing(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/documents/${documentId}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    record: {
                        id: document.id,
                        s3_url: document.s3_url,
                        filename: document.filename
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Error al analizar el documento');
            }

            const data = await response.json();
            setAnalysis(data);

            toast.current?.show({
                severity: 'success',
                summary: 'Análisis completado',
                detail: 'El documento ha sido analizado exitosamente',
                life: 3000
            });
        } catch (err) {
            console.error('Error analyzing document:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo analizar el documento',
                life: 3000
            });
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    if (error && !document) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                        <i className="pi pi-exclamation-circle mr-2"></i>
                        Error: {error}
                    </p>
                    <Button
                        label="Volver a documentos"
                        icon="pi pi-arrow-left"
                        className="p-button-text mt-4"
                        onClick={() => router.push('/home/documents')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <Toast ref={toast} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-sm"
                        onClick={() => router.push('/home/documents')}
                        tooltip="Volver a documentos"
                    />
                    <div className="flex items-center gap-2">
                        <i className="pi pi-file text-xl text-blue-900"></i>
                        <h2 className="font-semibold text-blue-950">
                            {document?.filename || 'Documento'}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">ID: {documentId}</span>
                    <Button
                        label="Analizar con IA"
                        icon="pi pi-sparkles"
                        className="p-button-success"
                        onClick={handleAnalyze}
                        loading={analyzing}
                        disabled={analyzing}
                    />
                </div>
            </div>

            {/* Content - Split View */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Column - PDF Viewer */}
                <div className="flex-1 lg:w-1/2 bg-gray-100 p-4 overflow-auto">
                    <div className="bg-white rounded-lg shadow-lg h-full">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-200">
                            <h3 className="font-semibold text-blue-950 flex items-center gap-2">
                                <i className="pi pi-file-pdf text-red-500"></i>
                                Documento Original
                            </h3>
                        </div>
                        <div className="h-full">
                            {document?.s3_url ? (
                                <iframe
                                    src={document.s3_url}
                                    className="w-full h-full border-0"
                                    title={document.filename}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No hay documento disponible</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Analysis */}
                <div className="flex-1 lg:w-1/2 bg-gray-50 p-4 overflow-auto">
                    {analyzing && (
                        <Card className="h-full">
                            <div className="flex flex-col items-center justify-center py-12">
                                <ProgressSpinner />
                                <p className="text-gray-600 mt-4">Analizando documento con IA...</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Esto puede tardar unos segundos
                                </p>
                            </div>
                        </Card>
                    )}

                    {analysis && !analyzing && (
                        <Card className="h-full overflow-auto">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="pi pi-sparkles text-purple-600 text-2xl"></i>
                                    <h3 className="text-xl font-bold text-blue-950">Análisis con IA</h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Resumen generado automáticamente
                                </p>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <i className="pi pi-info-circle text-blue-600 mt-1"></i>
                                    <div>
                                        <p className="font-semibold text-blue-900">Documento</p>
                                        <p className="text-sm text-blue-700">{analysis.filename}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <i className="pi pi-align-left text-purple-600"></i>
                                        Resumen
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {analysis.respuesta}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button
                                    label="Exportar análisis"
                                    icon="pi pi-download"
                                    className="p-button-outlined"
                                    onClick={() => {
                                        toast.current?.show({
                                            severity: 'info',
                                            summary: 'Próximamente',
                                            detail: 'Función de exportación en desarrollo',
                                            life: 3000
                                        });
                                    }}
                                />
                                <Button
                                    label="Analizar de nuevo"
                                    icon="pi pi-refresh"
                                    className="p-button-outlined"
                                    onClick={handleAnalyze}
                                    loading={analyzing}
                                />
                            </div>
                        </Card>
                    )}

                    {!analysis && !analyzing && !error && (
                        <Card className="h-full">
                            <div className="flex items-center justify-center h-full">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                                    <p className="text-yellow-800 text-center">
                                        <i className="pi pi-exclamation-triangle mr-2 text-2xl"></i>
                                        <br />
                                        Haz clic en "Analizar con IA" para obtener el resumen del documento.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {!analysis && !analyzing && error && (
                        <Card className="h-full">
                            <div className="flex items-center justify-center h-full">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                                    <p className="text-red-800 text-center mb-4">
                                        <i className="pi pi-exclamation-circle mr-2 text-2xl"></i>
                                        <br />
                                        Error al obtener el análisis: {error}
                                    </p>
                                    <Button
                                        label="Reintentar análisis"
                                        icon="pi pi-refresh"
                                        className="w-full"
                                        onClick={handleAnalyze}
                                        loading={analyzing}
                                    />
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
