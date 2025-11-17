"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

// Datos de ejemplo (en producción vendrían de una API/base de datos)
const MOCK_DOCUMENTS = {
    '1': { name: 'Contrato_Servicio_2024.pdf', url: '/sample.pdf' },
    '2': { name: 'Informe_Financiero_Q3.pdf', url: '/sample.pdf' },
    '3': { name: 'Propuesta_Comercial.pdf', url: '/sample.pdf' },
};

export default function DocumentViewPage() {
    const router = useRouter();
    const params = useParams();
    const documentId = params.id as string;

    // Estado del documento
    const [zoom, setZoom] = useState(100);
    const [extractedText, setExtractedText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    // Estado del chat
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hola, he analizado el documento. Puedo responder cualquier pregunta específica o hacer un análisis detallado del contenido.',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const toast = useRef<Toast>(null);

    // @ts-ignore - Mock document
    const document = MOCK_DOCUMENTS[documentId] || MOCK_DOCUMENTS['1'];

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleResetZoom = () => setZoom(100);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleExtractText = async () => {
        setIsExtracting(true);

        try {
            // TODO: Aquí va la integración con extracción de texto real
            // Ejemplo:
            // const formData = new FormData();
            // formData.append('file', documentFile);
            // const response = await fetch('/api/extract-text', {
            //     method: 'POST',
            //     body: formData
            // });
            // const data = await response.json();
            // setExtractedText(data.text);

            // Por ahora, simulamos la extracción
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockExtractedText = `Texto extraído del documento: ${document.name}\n\nContenido de ejemplo del documento...`;
            setExtractedText(mockExtractedText);

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Texto extraído correctamente',
                life: 3000
            });

            const aiMessage: Message = {
                id: Date.now().toString(),
                text: '✓ Texto extraído correctamente. Ya puedo analizar el contenido del documento. ¿Qué te gustaría saber?',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error al extraer texto:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo extraer el texto del documento',
                life: 3000
            });
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsAnalyzing(true);

        try {
            // TODO: Aquí va la integración con IA real (OpenAI, Anthropic, etc.)
            // Ejemplo:
            // const response = await fetch('/api/chat', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         message: inputMessage,
            //         documentText: extractedText,
            //         documentName: document.name,
            //         conversationHistory: messages
            //     })
            // });
            // const data = await response.json();
            // const aiText = data.message;

            // Por ahora, respuesta simulada
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: `Respuesta simulada sobre: "${inputMessage}"\n\nBasándome en el documento "${document.name}", ${extractedText ? 'he analizado el contenido y' : 'puedo decirte que'} esta es una respuesta de ejemplo. \n\n[Aquí se integrará la respuesta real de la IA]`,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error('Error al procesar mensaje:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar tu mensaje',
                life: 3000
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const quickQuestions = [
        "Resume el documento",
        "Extrae las fechas importantes",
        "¿Cuáles son los puntos clave?"
    ];

    const handleQuickQuestion = (question: string) => {
        setInputMessage(question);
    };

    return (
        <div className="h-full w-full flex flex-col">
            <Toast ref={toast} />

            {/* Header con controles */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-sm"
                        onClick={() => router.back()}
                        tooltip="Volver"
                    />
                    <div className="flex items-center gap-2">
                        <i className="pi pi-file text-xl text-blue-900"></i>
                        <h2 className="font-semibold text-blue-950">{document.name}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        icon="pi pi-search-minus"
                        onClick={handleZoomOut}
                        className="p-button-text p-button-sm"
                        tooltip="Alejar"
                        disabled={zoom <= 50}
                    />
                    <span className="text-sm text-gray-600 min-w-[60px] text-center font-medium">
                        {zoom}%
                    </span>
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
                    <a href={document.url} download={document.name}>
                        <Button
                            icon="pi pi-download"
                            className="p-button-text p-button-sm"
                            tooltip="Descargar"
                        />
                    </a>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex overflow-hidden">
                {/* Visor de documento - Lado izquierdo */}
                <div className="flex-1 overflow-auto bg-gray-100 p-4">
                    <div className="max-w-5xl mx-auto bg-white shadow-lg">
                        <iframe
                            src={document.url}
                            className="w-full border-0"
                            style={{
                                height: 'calc(100vh - 120px)',
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center'
                            }}
                            title={document.name}
                        />
                    </div>
                </div>

                {/* chats con IA - Lado derecho */}
                <div className="w-[450px] border-l border-gray-200 bg-white flex flex-col">
                    {/* Header del chat */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <i className="pi pi-sparkles text-purple-600 text-xl"></i>
                                <h3 className="font-bold text-blue-950">Chat con IA</h3>
                            </div>
                            <Button
                                icon="pi pi-file-export"
                                label="Extraer texto"
                                className="p-button-sm p-button-outlined"
                                onClick={handleExtractText}
                                loading={isExtracting}
                                tooltip="Extraer texto del documento"
                            />
                        </div>
                        <p className="text-xs text-gray-600">
                            {extractedText ? '✓ Texto extraído' : 'Extrae el texto para analizar el documento'}
                        </p>
                    </div>

                    {/* Preguntas rápidas */}
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Preguntas sugeridas:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((question, index) => (
                                <Button
                                    key={index}
                                    label={question}
                                    className="p-button-sm p-button-outlined text-xs"
                                    onClick={() => handleQuickQuestion(question)}
                                    disabled={!extractedText}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mensajes del chat */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        style={{ maxHeight: 'calc(100vh - 350px)' }}
                    >
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar
                                    icon={message.sender === 'ai' ? 'pi pi-sparkles' : 'pi pi-user'}
                                    className={message.sender === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
                                    shape="circle"
                                    size="normal"
                                />
                                <div
                                    className={`flex-1 p-3 rounded-xl ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                    style={{ maxWidth: '85%' }}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {message.timestamp.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isAnalyzing && (
                            <div className="flex gap-3">
                                <Avatar
                                    icon="pi pi-sparkles"
                                    className="bg-purple-100 text-purple-600"
                                    shape="circle"
                                />
                                <div className="bg-gray-100 p-3 rounded-xl">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input del chat */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <InputTextarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Haz una pregunta sobre este documento..."
                                rows={2}
                                className="flex-1 text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isAnalyzing}
                            />
                            <Button
                                icon="pi pi-send"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isAnalyzing}
                                className="p-button-rounded p-button-primary"
                                tooltip="Enviar (Enter)"
                            />
                        </div>
                        {!extractedText && (
                            <p className="text-xs text-amber-600 mt-2">
                                ⚠️ Extrae el texto del documento para obtener respuestas más precisas
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}