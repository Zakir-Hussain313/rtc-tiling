"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import fallbackImage from "../../assets/images/noroot -copy.png";
import type { StaticImageData } from "next/image";

type Props = {
    images: string[];
};

export default function StoryImageCycler({ images }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    const resolvedImages = images.length > 0 ? images : null;

    useEffect(() => {
        if (!resolvedImages || resolvedImages.length <= 1) return;

        const interval = setInterval(() => {
            // Fade out
            setVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % resolvedImages.length);
                setVisible(true);
            }, 400);
        }, 5000);

        return () => clearInterval(interval);
    }, [resolvedImages]);

    const currentSrc: string | StaticImageData =
        resolvedImages ? resolvedImages[currentIndex] : fallbackImage;

    return (
        <div className="imageWrapper">
            <Image
                src={currentSrc}
                alt="Our story"
                fill
                className="image"
                style={{
                    objectFit: "cover",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.4s ease-in-out",
                }}
                sizes="(max-width: 768px) 100vw, 560px"
                priority
            />
        </div>
    );
}