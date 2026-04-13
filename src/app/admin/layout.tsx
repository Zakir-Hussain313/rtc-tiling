'use client';

import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import './global.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="adminShell">
            <Sidebar
                isOpen={sidebarOpen}
                onOpen={() => setSidebarOpen(true)}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="adminMain">
                {children}
            </div>
        </div>
    );
}