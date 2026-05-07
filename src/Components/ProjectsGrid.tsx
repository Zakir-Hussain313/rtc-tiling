'use client';

import { useState } from 'react';
import '../styles/Landing/featured.css';
import CyclingImage from './CyclingImage';
import Image from 'next/image';

const SPAN_PATTERN = [4, 2, 3, 2, 3, 4];

type Props = {
    images: string[];
    title: string;
};

export default function ProjectsGrid({ images, title }: Props) {
    const [lightbox, setLightbox] = useState<string | null>(null);

    const filtered = images.filter(Boolean);
    if (!filtered.length) return null;

    return (
        <>
            <section className="image-section">
                {filtered.map((src, i) => (
                    <div
                        key={i}
                        className="image-div featured-clickable"
                        style={{ gridColumn: `span ${SPAN_PATTERN[i % SPAN_PATTERN.length]}` }}
                        onClick={() => setLightbox(src)}
                    >
                        <CyclingImage
                            images={[src]}
                            alt={`${title} image ${i + 1}`}
                            sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="featured-image-overlay">
                            <span>View</span>
                        </div>
                    </div>
                ))}
            </section>

            {lightbox && (
                <div
                    className="featured-lightbox-overlay"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="featured-lightbox-close"
                        onClick={() => setLightbox(null)}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div
                        className="featured-lightbox-img-wrap"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={lightbox}
                            alt={title}
                            width={1200}
                            height={800}
                            className="featured-lightbox-img"
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </>
    );
}