'use client';

import Link from 'next/link';
import '../styles/Landing/featured.css';
import CyclingImage from './CyclingImage';

type Project = {
    _id: string;
    title: string;
    images: string[];
    slug: string;
};

const GRID_CLASSES = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

export default function FeaturedGrid({ projects }: { projects: Project[] }) {
    const filtered = projects.filter((p) => p.images?.[0]).slice(0, 6);

    if (!filtered.length) return null;

    return (
        <section className="image-section">
            {filtered.map((project, i) => (
                <Link
                    key={String(project._id)}
                    href={`/projects/${project.slug}`}
                    className={`image-div ${GRID_CLASSES[i]} featured-clickable`}
                    aria-label={`View ${project.title}`}
                >
                    <CyclingImage
                        images={project.images}
                        alt={project.title}
                        sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="featured-image-overlay">
                        <span>{project.title}</span>
                    </div>
                </Link>
            ))}
        </section>
    );
}