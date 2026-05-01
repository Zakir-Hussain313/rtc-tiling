'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import '../styles/Landing/featured.css';

type Project = {
    _id: string;
    title: string;
    images: string[];
    slug: string;
};

const GRID_CLASSES = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];

export default function FeaturedGrid() {
    const [projects, setProjects]   = useState<Project[]>([]);
    const [lightbox, setLightbox]   = useState<Project | null>(null);

    const [scale, setScale]         = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const isDragging                = useRef(false);
    const dragStart                 = useRef({ x: 0, y: 0 });
    const lastTranslate             = useRef({ x: 0, y: 0 });
    const lastPinchDist             = useRef<number | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res  = await fetch('/api/projects?featured=true', { cache: 'no-store' });
                const json = await res.json();
                const all: Project[] = json.data ?? [];
                setProjects(all.filter((p) => p.images?.[0]).slice(0, 6));
            } catch (err) {
                console.error('[FeaturedGrid] fetch failed', err);
            }
        }
        load();
    }, []);

    function openLightbox(project: Project) {
        setLightbox(project);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        lastTranslate.current = { x: 0, y: 0 };
        document.body.style.overflow = 'hidden';
    }

    const closeLightbox = useCallback(() => {
        setLightbox(null);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        lastTranslate.current = { x: 0, y: 0 };
        document.body.style.overflow = '';
    }, []);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') closeLightbox();
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [closeLightbox]);

    function handleWheel(e: React.WheelEvent) {
        e.preventDefault();
        setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 1), 4));
    }

    function handleMouseDown(e: React.MouseEvent) {
        if (scale <= 1) return;
        isDragging.current = true;
        dragStart.current  = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!isDragging.current) return;
        setTranslate({
            x: lastTranslate.current.x + (e.clientX - dragStart.current.x),
            y: lastTranslate.current.y + (e.clientY - dragStart.current.y),
        });
    }

    function handleMouseUp() {
        if (!isDragging.current) return;
        isDragging.current    = false;
        lastTranslate.current = { ...translate };
    }

    function handleTouchStart(e: React.TouchEvent) {
        if (e.touches.length === 1) {
            dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        lastPinchDist.current = null;
    }

    function handleTouchMove(e: React.TouchEvent) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx   = e.touches[0].clientX - e.touches[1].clientX;
            const dy   = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (lastPinchDist.current !== null) {
                setScale((prev) => Math.min(Math.max(prev + (dist - lastPinchDist.current!) * 0.005, 1), 4));
            }
            lastPinchDist.current = dist;
        } else if (e.touches.length === 1 && scale > 1) {
            setTranslate({
                x: lastTranslate.current.x + (e.touches[0].clientX - dragStart.current.x),
                y: lastTranslate.current.y + (e.touches[0].clientY - dragStart.current.y),
            });
        }
    }

    function handleTouchEnd() {
        lastPinchDist.current = null;
        lastTranslate.current = { ...translate };
    }

    useEffect(() => {
        if (scale <= 1) {
            setTranslate({ x: 0, y: 0 });
            lastTranslate.current = { x: 0, y: 0 };
        }
    }, [scale]);

    return (
        <>
            {projects.length > 0 && (
                <section className="image-section">
                    {projects.map((project, i) => (
                        <div
                            key={project._id}
                            className={`image-div ${GRID_CLASSES[i]} featured-clickable`}
                            onClick={() => openLightbox(project)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${project.title}`}
                            onKeyDown={(e) => e.key === 'Enter' && openLightbox(project)}
                        >
                            <Image
                                src={project.images?.[0]}
                                alt={project.title}
                                fill
                                sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                            />
                            <div className="featured-image-overlay">
                                <span>{project.title}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {lightbox && (
                <div className="featured-lightbox-overlay" onClick={closeLightbox}>
                    <button className="featured-lightbox-close" onClick={closeLightbox} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {scale === 1 && (
                        <p className="featured-lightbox-hint">Scroll or pinch to zoom</p>
                    )}

                    <div
                        className="featured-lightbox-img-wrap"
                        onClick={(e) => e.stopPropagation()}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                            cursor: scale > 1 ? 'grab' : 'zoom-in',
                        }}
                    >
                        <img
                            src={lightbox.images?.[0]}
                            alt={lightbox.title}
                            className="featured-lightbox-img"
                            draggable={false}
                        />
                    </div>

                    <p className="featured-lightbox-title">{lightbox.title}</p>
                </div>
            )}
        </>
    );
}