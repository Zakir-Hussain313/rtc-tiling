'use client';

import { useEffect, useRef } from 'react';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
}

export default function FadeIn({
    children,
    className = '',
    delay = 0,
    threshold = 0.1,
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        console.log('FadeIn mounted:', el.className, el.getBoundingClientRect());

        const rect = el.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight;

        el.classList.add('fade-init');
        if (delay) el.style.transitionDelay = `${delay}ms`;

        if (isAboveFold) {
            const raf = requestAnimationFrame(() => {
                el.classList.add('fade-in');
            });
            return () => cancelAnimationFrame(raf);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('fade-in');
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, threshold]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}