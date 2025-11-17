import React from 'react';
import { Card } from 'primereact/card';
import 'primeicons/primeicons.css';

interface KeyDataCardProps {
    icon: string; // Icono de PrimeIcons (ej: 'pi-calendar')
    label: string; // Etiqueta del dato (ej: 'Fecha del contrato')
    value: string; // El valor extraído (ej: '15 de enero de 2024')
}

export function KeyDataCard({ icon, label, value }: KeyDataCardProps) {
    return (
        <Card className="flex-1 min-w-[200px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                {/* Icono pequeño y la etiqueta */}
                <i className={`pi ${icon} text-sm text-cyan-600`}></i>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
            </div>
            {/* El valor extraído */}
            <p className="text-xl font-semibold text-gray-800">{value}</p>
        </Card>
    );
}