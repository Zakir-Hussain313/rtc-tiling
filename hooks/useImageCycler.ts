import { useState, useEffect, useRef } from 'react';

export function useImageCycler(images: string[], interval = 5000) {
    const [topIndex, setTopIndex] = useState(0);
    const [botIndex, setBotIndex] = useState(1);
    const [fading, setFading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (images.length <= 1) return;

        const cycle = setInterval(() => {
            setFading(true);
            timerRef.current = setTimeout(() => {
                setTopIndex((prev) => {
                    const next = (prev + 1) % images.length;
                    setBotIndex((next + 1) % images.length);
                    return next;
                });
                setFading(false);
            }, 600);
        }, interval);

        return () => {
            clearInterval(cycle);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [images, interval]);

    return { topIndex, botIndex, fading };
}