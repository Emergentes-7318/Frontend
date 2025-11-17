"use client";
import Image from "next/image";
import React, {useState} from "react";
import { useRouter } from "next/navigation";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

export default function Home() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Aquí puedes agregar validación de credenciales
        if (email && password) {
            // Redirigir a la página de documentos
            router.push("/home/documents");
        }
    };


    return (
      <div className="flex flex-col gap-5 justify-center items-center absolute w-full h-full bg-gray-50">
          <div className="flex flex-col items-center gap-5">
              <Image src="/img_1.png" alt="Logo" width={80} height={40}/>
              <h1 className="text-4xl font-bold text-blue-900">DocMind</h1>
              <p className="text-lg text-gray-700"> Accede a tu cuenta</p>
          </div>
          <div className="bg-white shadow-2xl rounded-2xl p-10 w-fit lg:w-96 flex flex-col items-center">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-1">
                      <label className="text-blue-950 text-sm font-medium">Email</label>
                      <div
                          className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus-within:border-blue-500 shadow-sm">
                          <i className="pi pi-envelope text-gray-400 text-lg"></i>
                          <input
                              type="email"
                              placeholder="email@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="ml-3 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                              required
                          />
                      </div>
                  </div>
                  <div className="flex flex-col gap-1">
                      <label className="text-blue-950 text-sm font-medium">Contraseña</label>
                      <div
                          className="flex items-center w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus-within:border-blue-500 shadow-sm">
                          <i className="pi pi-lock text-gray-400 text-lg"></i>
                          <input
                              type="password"
                              placeholder="********"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="ml-3 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                              required
                          />
                      </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                      <label className="flex items-center gap-2 text-gray-700">
                          <input type="checkbox" className="accent-teal-500"/>
                          Recordarme
                      </label>
                      <a href="#" className="text-teal-500 hover:underline">¿Olvidaste tu contraseña?</a>
                  </div>
                  <button
                      type="submit"
                      className="bg-teal-500 text-white rounded-xl py-2 font-semibold shadow-md hover:bg-teal-400 transition duration-200"
                  >
                      Iniciar sesión
                  </button>

                  <div className="flex items-center gap-3">
                      <hr className="flex-grow border-gray-300"/>
                      <span className="text-gray-500 text-sm">O continúa con</span>
                      <hr className="flex-grow border-gray-300"/>
                  </div>

                  <button
                      type="button"
                      onClick={() => router.push("/home/documents")}
                      className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2 hover:bg-gray-50 transition duration-200"
                  >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                      <span className="text-gray-700 font-medium">Continuar con Google</span>
                  </button>

                  <div className="text-center text-sm mt-3">
                      <span className="text-gray-600">¿No tienes cuenta?</span>
                      <a href="#" className="text-teal-500 font-medium hover:underline">Regístrate gratis</a>
                  </div>
              </form>
          </div>

      </div>
  );
}
