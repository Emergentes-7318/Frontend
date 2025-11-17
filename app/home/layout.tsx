import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/app/components/Sidebar";
import React from "react";
import {SearchBar} from "@/app/components/SearchBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocMind",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex">
          <Sidebar/>
          <main className="flex-1 ml-0 md:ml-64 absolute w-full h-full bg-gray-50">
              <div className="bg-white border border-gray-300 flex items-center pl-5 w-full h-24">
                  <SearchBar/>
              </div>
              {children}
          </main>
      </div>
      </body>

      </html>
  );
}
