'use client';

import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import './global.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="adminShell">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="adminMain">
                <div
                    className="adminMainInner"
                    data-sidebar-toggle="true"
                    onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('.hamburgerBtn')) {
                            setSidebarOpen(true);
                        }
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}