"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const documentId = params.id as string;

    const [document, setDocument] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toast = useRef<Toast>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch document details
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const response = await fetch(`${apiUrl}/documents/${documentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    router.push('/auth/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al cargar el documento');
                }

                const data = await response.json();
                setDocument(data);

                // Add welcome message
                setMessages([{
                    id: '1',
                    text: `¡Hola! Estoy listo para responder preguntas sobre "${data.filename}". ¿En qué puedo ayudarte?`,
                    sender: 'ai',
                    timestamp: new Date()
                }]);
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
    }, [documentId, apiUrl, router]);

    // Send message to chat endpoint
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || sending) return;

        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setSending(true);

        try {
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: inputMessage,
                    documentId: documentId
                })
            });

            if (!response.ok) {
                throw new Error('Error al procesar la pregunta');
            }

            const data = await response.json();
            console.log('Chat response:', data); // Debug log

            // Try different possible field names (including backend typo 'awnser')
            const answerText = data.awnser || data.answer || data.respuesta || data.response || data.message || JSON.stringify(data);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: answerText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (err) {
            console.error('Error sending message:', err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar tu pregunta',
                life: 3000
            });

            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setSending(false);
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
                        <i className="pi pi-comments text-xl text-purple-600"></i>
                        <h2 className="font-semibold text-blue-950">
                            Chat: {document?.filename || 'Documento'}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">ID: {documentId}</span>
                </div>
            </div>

            {/* Split View Content */}
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

                {/* Right Column - Chat Interface */}
                <div className="flex-1 lg:w-1/2 bg-gray-50 p-4 flex flex-col overflow-hidden">
                    <Card className="flex-1 flex flex-col overflow-hidden">
                        {/* Chat Header */}
                        <div className="mb-4 pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <i className="pi pi-sparkles text-purple-600 text-2xl"></i>
                                <h3 className="text-xl font-bold text-blue-950">Asistente IA</h3>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Haz preguntas sobre el documento
                            </p>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
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
                                        className={`flex-1 p-3 rounded-xl ${message.sender === 'user'
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

                            {sending && (
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

                        {/* Input Area */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex gap-2">
                                <InputTextarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Escribe tu pregunta aquí..."
                                    rows={2}
                                    className="flex-1 text-sm"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={sending}
                                />
                                <Button
                                    icon="pi pi-send"
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || sending}
                                    loading={sending}
                                    className="p-button-rounded p-button-primary"
                                    tooltip="Enviar (Enter)"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Presiona Enter para enviar, Shift+Enter para nueva línea
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
