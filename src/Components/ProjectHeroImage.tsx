'use client';

import CyclingImage from './CyclingImage';

type Props = {
    images: string[];
    title: string;
};

export default function ProjectHeroImage({ images, title }: Props) {
    return (
        <CyclingImage
            images={images}
            alt={title}
            sizes="(max-width: 768px) 100vw, 50vw"
        />
    );
}