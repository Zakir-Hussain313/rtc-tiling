'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { optimizeCloudinaryUrl } from 'lib/cloudinaryUtils'

type Review = {
    name: string
    role: string
    image: string
    review: string
    rating?: number
}

export default function TestimonialsTrack({ items }: { items: Review[] }) {
    const [paused, setPaused] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const trackRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const scrollLeft = useRef(0)
    const animationOffset = useRef(0)
    const rafId = useRef<number | null>(null)
    const lastTimestamp = useRef<number | null>(null)
    const outerRef = useRef<HTMLDivElement>(null)

    // Speed in px/sec
    const SPEED = 40

    // Sync CSS animation offset → our ref when drag starts
    const getComputedOffset = () => {
        const track = trackRef.current
        if (!track) return 0
        const style = window.getComputedStyle(track)
        const matrix = new DOMMatrixReadOnly(style.transform)
        return matrix.m41 // translateX value
    }

    // Manual animation loop (takes over from CSS when dragging or paused by hold)
    const startRAF = () => {
        if (rafId.current !== null) return
        lastTimestamp.current = null

        const step = (ts: number) => {
            if (lastTimestamp.current === null) lastTimestamp.current = ts
            const delta = ts - lastTimestamp.current
            lastTimestamp.current = ts

            if (!isDragging.current) {
                animationOffset.current -= (SPEED * delta) / 1000
            }

            const track = trackRef.current
            if (track) {
                const trackWidth = track.scrollWidth / 3
                if (animationOffset.current <= -trackWidth) {
                    animationOffset.current += trackWidth
                }
                track.style.transform = `translateX(${animationOffset.current}px)`
            }

            rafId.current = requestAnimationFrame(step)
        }

        rafId.current = requestAnimationFrame(step)
    }

    const stopRAF = () => {
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current)
            rafId.current = null
        }
    }

    // Pause CSS animation and hand off to RAF
    const takeover = () => {
        const track = trackRef.current
        if (!track) return
        animationOffset.current = getComputedOffset()
        track.style.animation = 'none'
        track.style.transform = `translateX(${animationOffset.current}px)`
        startRAF()
    }

    // Hand back to CSS animation
    const handback = () => {
        stopRAF()
        const track = trackRef.current
        if (!track) return
        track.style.animation = ''
        track.style.transform = ''
    }

    // Mouse hover pause (desktop only, not drag)
    const handleMouseEnter = () => {
        if (!isDragging.current) setPaused(true)
    }
    const handleMouseLeave = () => {
        if (!isDragging.current) setPaused(false)
    }

    // Drag — Mouse
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startX.current = e.clientX
        scrollLeft.current = animationOffset.current
        takeover()
        setPaused(true)
    }

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            const dx = e.clientX - startX.current
            animationOffset.current = scrollLeft.current + dx
        }

        const onMouseUp = () => {
            if (!isDragging.current) return
            isDragging.current = false
            setPaused(false)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    // Drag — Touch
    const onTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true
        startX.current = e.touches[0].clientX
        scrollLeft.current = animationOffset.current
        takeover()
        setPaused(true)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return
        const dx = e.touches[0].clientX - startX.current
        animationOffset.current = scrollLeft.current + dx
    }

    const onTouchEnd = () => {
        isDragging.current = false
        setPaused(false)
    }

    // Sync pause state → RAF or CSS
    useEffect(() => {
        if (paused) {
            takeover()
        } else if (!isDragging.current) {
            handback()
        }
    }, [paused])

    return (
        <div
            ref={outerRef}
            className="marquee-outer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
            <div
                ref={trackRef}
                className={`marquee-track${paused && !isDragging.current ? ' marquee-track--paused' : ''}`}
            >
                {items.map((review, index) => (
                    <div
                        className={`testimonial-card${hoveredIndex === index ? ' testimonial-card--dark' : ''}`}
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {review.rating && (
                            <div className="testimonial-stars">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                        )}
                        <p className="testimonial-review">&quot;{review.review}&quot;</p>
                        <div className="testimonial-footer">
                            <div className="testimonial-image">
                                {review.image ? (
                                    <Image
                                        src={optimizeCloudinaryUrl(review.image, 100)}
                                        alt={review.name}
                                        fill
                                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="testimonial-avatar-placeholder">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="testimonial-meta">
                                <h3 className="testimonial-name">{review.name}</h3>
                                <span className="testimonial-role">{review.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}