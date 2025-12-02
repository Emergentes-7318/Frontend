"use client";
import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { SearchBar } from "@/app/components/SearchBar";
import { Button } from "primereact/button";

export default function ConfigPage() {
  const [fullName, setFullName] = useState("Juan Pérez");
  const [email, setEmail] = useState("juan@empresa.com");
  const [company, setCompany] = useState("Empresa S.A.");
  const [role, setRole] = useState("Analista de Documentos");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <div className="bg-white border border-gray-300 flex items-center pl-5 w-full h-24">
          <SearchBar />
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <header className="mb-2">
              <h1 className="text-3xl font-bold text-blue-950">Configuración</h1>
              <p className="text-gray-500 mt-2">Gestiona tu cuenta y preferencias</p>
            </header>

            {/* Perfil de usuario */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="pi pi-user text-2xl text-blue-800"></i>
                    <div>
                      <h2 className="font-semibold text-gray-800">Perfil de Usuario</h2>
                      <p className="text-sm text-gray-500">Información personal y foto de perfil</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs text-gray-500">Nombre completo</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Correo electrónico</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Empresa</label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Rol</label>
                      <input
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button label="Guardar cambios" className="p-button-success" />
                  </div>
                </div>

                <div className="w-48 flex-shrink-0">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold mb-3">JP</div>
                    <Button label="Cambiar foto" className="p-button-outlined p-button-sm w-full mb-2" />
                    <div className="text-xs text-gray-500">Recomendado: JPG, PNG o GIF, máximo 2MB</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Integraciones & Apariencia */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <i className="pi pi-link text-2xl text-purple-600"></i>
                  <h3 className="font-semibold text-gray-800">Integraciones</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-blue-700 font-semibold">G</div>
                      <div>
                        <div className="font-medium">Google Drive</div>
                        <div className="text-xs text-gray-500">Importa documentos desde Drive</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Conectado</span>
                      <Button label="Configurar" className="p-button-outlined p-button-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="pi pi-key text-xl text-gray-600"></i>
                      <div>
                        <div className="font-medium">API Key</div>
                        <div className="text-xs text-gray-500">Integración con sistemas externos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button label="Generar clave" className="p-button-outlined p-button-sm" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <i className="pi pi-palette text-2xl text-orange-500"></i>
                  <h3 className="font-semibold text-gray-800">Apariencia</h3>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Modo oscuro</div>
                    <div className="text-xs text-gray-500">Cambia entre tema claro y oscuro</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                    <span className={`ml-2 text-sm ${darkMode ? 'text-blue-700' : 'text-gray-500'}`}>{darkMode ? 'Activado' : 'Desactivado'}</span>
                  </label>
                </div>
              </section>
            </div>

            {/* Plan y Suscripción */}
            <section className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <i className="pi pi-wallet text-2xl text-green-600"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Plan y Suscripción</h3>
                  <p className="text-sm text-gray-500">Gestiona tu plan actual</p>
                </div>
              </div>

              <div className="mt-3 border rounded-lg p-4 bg-gradient-to-r from-blue-700 to-teal-400 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase bg-white/10 inline-block px-2 py-1 rounded-full mb-1">Plan Profesional</div>
                    <div className="text-3xl font-bold">€49/mes</div>
                    <ul className="mt-3 text-sm space-y-1">
                      <li>✓ 500 documentos por mes</li>
                      <li>✓ Análisis con IA ilimitado</li>
                      <li>✓ Exportación a PDF, Word, Markdown</li>
                      <li>✓ Integraciones con Drive y API</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 items-end">
                    <Button label="Cambiar plan" className="p-button-outlined p-button-sm bg-white/10 border-white/20 text-white" />
                    <Button label="Cancelar suscripción" className="p-button-danger p-button-sm" />
                  </div>
                </div>
              </div>

            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
