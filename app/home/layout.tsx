import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/app/components/Sidebar";
import React from "react";
import { SearchBar } from "@/app/components/SearchBar";

export const metadata: Metadata = {
  title: "DocMind",
  description: "",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 transition-all duration-300 w-full min-h-screen bg-gray-50">
        <div className="bg-white border border-gray-300 flex items-center pl-5 w-full h-24">
          <SearchBar />
        </div>
        {children}
      </main>
    </div>
  );
}
