
'use client';

import { useEffect } from 'react';

export default function VhFix() {
    useEffect(() => {
        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();
    }, []);

    return null;
}