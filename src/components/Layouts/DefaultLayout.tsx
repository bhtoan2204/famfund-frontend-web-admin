"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen overflow-hidden relative">
      {sidebarOpen ? <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />: <></>}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300" 
        >
          {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-3xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
