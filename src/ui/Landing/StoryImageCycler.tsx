"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import fallbackImage from "../../assets/images/noroot -copy.png";

type Props = {
    images: string[];
};

export default function StoryImageCycler({ images }: Props) {
    const [topIndex, setTopIndex] = useState(0);   // image on top (visible)
    const [botIndex, setBotIndex] = useState(1);   // image underneath (preloaded)
    const [fading, setFading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const imgs = images.length > 0 ? images : null;

    useEffect(() => {
        if (!imgs || imgs.length <= 1) return;

        const cycle = () => {
            setFading(true); // fade out top image

            timerRef.current = setTimeout(() => {
                setTopIndex((prev) => {
                    const next = (prev + 1) % imgs.length;
                    setBotIndex((next + 1) % imgs.length); // preload the one after
                    return next;
                });
                setFading(false); // snap top back to visible with new src
            }, 600);
        };

        const interval = setInterval(cycle, 5000);
        return () => {
            clearInterval(interval);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [imgs]);

    if (!imgs) {
        return (
            <div className="imageWrapper">
                <Image
                    src={fallbackImage}
                    alt="Our story"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 560px"
                    priority
                />
            </div>
        );
    }

    return (
        <div className="imageWrapper" style={{ position: "relative" }}>
            <Image
                key={`bot-${botIndex}`}
                src={imgs[botIndex]}
                alt="Our story"
                fill
                style={{
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
                sizes="(max-width: 768px) 100vw, 560px"
            />

            <Image
                key={`top-${topIndex}`}
                src={imgs[topIndex]}
                alt="Our story"
                fill
                style={{
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    opacity: fading ? 0 : 1,
                    transition: "opacity 0.6s ease-in-out",
                }}
                sizes="(max-width: 768px) 100vw, 560px"
                priority
            />
        </div>
    );
}