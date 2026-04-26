'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/Sidebar.css';
import Image from 'next/image';
import logo from '../assets/images/Rtc.png'

const navItems = [
    {
        href: '/admin/hero',
        label: 'Hero Background',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
            </svg>
        ),
    },
    {
        href: '/admin/projects',
        label: 'Projects',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
        ),
    },
    {
        href: '/admin/services',
        label: 'Services',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
    {
        href: '/admin/stats',
        label: 'Business Stats',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        href: '/admin/about-images',
        label: 'About Page Images',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
        ),
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpen }: SidebarProps) {
    const pathname = usePathname();

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            window.location.href = '/';

        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    function handleNavClick() {
        onClose();
    }

    return (
        <>
            <button
                className="sidebarHamburger"
                onClick={onOpen}
                aria-label="Open menu"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>
            <div
                className={`sidebarBackdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebarLogo">
                    <div className="sidebarLogoMark">
                        <div className="logoIcon">
                            <Image
                                src={logo}
                                alt='Logo'
                                width={50}
                                height={50}
                                className='object-cover'
                            />
                        </div>
                        <div>
                            <div className="logoText">RTC-Tiling</div>
                            <div className="logoSub">Content Manager</div>
                        </div>
                    </div>
                    <button className="sidebarCloseBtn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav className="sidebarNav">
                    <div className="navSectionLabel">Website Content</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`navItem ${pathname === item.href ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                    <div className="sidebarFooter my-12">
                    <button className="logoutBtn" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
                </nav>
            </aside>
        </>
    );
}