'use client';

import Link from 'next/link';
import '../styles/Landing/featured.css';
import CyclingImage from './CyclingImage';

type Service = {
    _id: string;
    title: string;
    images: string[];
    slug: string;
};

const GRID_CLASSES = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

export default function ServicesGrid({ services }: { services: Service[] }) {
    const filtered = services.filter((s) => s.images?.[0]).slice(0, 6);

    if (!filtered.length) return null;

    return (
        <section className="image-section">
            {filtered.map((service, i) => (
                <Link
                    key={String(service._id)}
                    href={`/services/${service.slug}`}
                    className={`image-div ${GRID_CLASSES[i]} featured-clickable`}
                    aria-label={`View ${service.title}`}
                >
                    <CyclingImage
                        images={service.images}
                        alt={service.title}
                        sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="featured-image-overlay">
                        <span>{service.title}</span>
                    </div>
                </Link>
            ))}
        </section>
    );
}