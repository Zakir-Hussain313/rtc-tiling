"use client";

import Image from "next/image";
import fallbackImage from "../../assets/images/noroot -copy.png";
import { useImageCycler } from "../../../hooks/useImageCycler";
import { optimizeCloudinaryUrl } from "lib/cloudinary";

type Props = {
    images: string[];
};

export default function StoryImageCycler({ images }: Props) {
    const { topIndex, botIndex, fading } = useImageCycler(images);

    if (images.length === 0) {
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
                src={optimizeCloudinaryUrl(images[botIndex], 800)}
                alt="Our story"
                fill
                style={{ objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                sizes="(max-width: 768px) 100vw, 560px"
            />
            <Image
                key={`top-${topIndex}`}
                src={optimizeCloudinaryUrl(images[topIndex], 800)}
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