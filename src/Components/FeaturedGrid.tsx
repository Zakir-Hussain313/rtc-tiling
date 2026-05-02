'use client';

import { useEffect, useState } from 'react';
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

export default function FeaturedGrid() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/projects?featured=true', { cache: 'no-store' });
                const json = await res.json();
                const all: Project[] = json.data ?? [];
                setProjects(all.filter((p) => p.images?.[0]).slice(0, 6));
            } catch (err) {
                console.error('[FeaturedGrid] fetch failed', err);
            }
        }
        load();
    }, []);

    return (
        <>
            {projects.length > 0 && (
                <section className="image-section">
                    {projects.map((project, i) => (
                        <Link
                            key={project._id}
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
            )}
        </>
    );
}