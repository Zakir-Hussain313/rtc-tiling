'use client';

import Image from 'next/image';
import { useImageCycler } from 'hooks/useImageCycler';

type Props = {
    images: string[];
    alt: string;
    sizes: string;
};

export default function CyclingImage({ images, alt, sizes }: Props) {
    const { topIndex, botIndex, fading } = useImageCycler(images);

    if (images.length === 1) {
        return (
            <Image
                src={images[0]}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover"
            />
        );
    }

    return (
        <>
            <Image
                key={`bot-${botIndex}`}
                src={images[botIndex]}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover"
                style={{ zIndex: 1 }}
            />
            <Image
                key={`top-${topIndex}`}
                src={images[topIndex]}
                alt={alt}
                fill
                sizes={sizes}
                className="object-cover"
                style={{
                    zIndex: 2,
                    opacity: fading ? 0 : 1,
                    transition: 'opacity 0.6s ease-in-out',
                }}
                priority
            />
        </>
    );
}