"use client";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { KeyDataCard } from "@/app/components/KeyDataCards";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

const MOCK_REPORT_DATA = {
    documentName: "Contrato_Servicio_2024.pdf",
    summary: "El valor total acordado es de €45.000 más IVA, dividido en cuatro cuotas trimestrales...",
    keyData: [
        { icon: "pi-calendar", label: "Fecha del contrato", value: "15 de enero de 2024" },
        { icon: "pi-hourglass", label: "Vigencia", value: "12 meses (renovable)" },
        { icon: "pi-money-bill", label: "Valor total", value: "€45.000 + IVA" },
        { icon: "pi-wallet", label: "Forma de pago", value: "4 cuotas trimestrales" },
    ]
};

export default function ReportPage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-950">Resumen Ejecutivo</h1>
                    <p className="text-gray-500 mb-4">
                        Análisis generado por IA • {MOCK_REPORT_DATA.documentName}
                    </p>

                    <div className="flex gap-3">
                        <Button
                            label={isEditing ? "Guardar" : "Editar resumen"}
                            icon={isEditing ? "pi pi-save" : "pi pi-pencil"}
                            onClick={() => setIsEditing(!isEditing)}
                            className={isEditing ? "p-button-success" : "p-button-secondary p-button-outlined"}
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-bookmark"
                            className="p-button-outlined"
                            disabled={isEditing}
                        />
                        <Button
                            label="Exportar PDF"
                            icon="pi pi-file-export"
                            className="p-button-success"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-blue-50">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="pi pi-file-o text-2xl text-purple-600"></i>
                        <h2 className="font-semibold text-gray-800">Resumen del Documento</h2>
                    </div>

                    {isEditing ? (
                        <textarea
                            value={MOCK_REPORT_DATA.summary}
                            onChange={() => { }}
                            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            rows={5}
                        />
                    ) : (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            El valor total acordado es de **€45.000 más IVA**, dividido en cuatro cuotas trimestrales...
                        </p>
                    )}
                </div>

                <h2 className="text-xl font-bold text-blue-950 mb-4">Datos Clave</h2>
                <div className="flex flex-wrap gap-4">
                    {MOCK_REPORT_DATA.keyData.map((data, index) => (
                        <KeyDataCard
                            key={index}
                            icon={data.icon}
                            label={data.label}
                            value={data.value}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
