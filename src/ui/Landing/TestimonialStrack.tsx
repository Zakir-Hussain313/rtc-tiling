'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { optimizeCloudinaryUrl } from 'lib/cloudinaryUtils'

type Review = {
    name: string
    role: string
    image: string
    review: string
    rating?: number
}

const SPEED = 40 // px/sec

export default function TestimonialsTrack({ items }: { items: Review[] }) {
    const [dragging, setDragging] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const trackRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const isPaused = useRef(false)
    const startX = useRef(0)
    const dragStartOffset = useRef(0)
    const animationOffset = useRef(0)
    const rafId = useRef<number | null>(null)
    const lastTimestamp = useRef<number | null>(null)

    const getComputedTranslateX = () => {
        const track = trackRef.current
        if (!track) return 0
        const matrix = new DOMMatrixReadOnly(window.getComputedStyle(track).transform)
        return matrix.m41
    }

    const stopRAF = useCallback(() => {
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current)
            rafId.current = null
        }
    }, [])

    const startRAF = useCallback(() => {
        if (rafId.current !== null) return
        lastTimestamp.current = null

        const step = (ts: number) => {
            if (lastTimestamp.current === null) lastTimestamp.current = ts
            const delta = ts - lastTimestamp.current
            lastTimestamp.current = ts

            if (!isDragging.current && !isPaused.current) {
                animationOffset.current -= (SPEED * delta) / 1000
            }

            const track = trackRef.current
            if (track) {
                const trackWidth = track.scrollWidth / 3
                // Wrap in both directions so dragging backwards also loops
                if (animationOffset.current <= -trackWidth) {
                    animationOffset.current += trackWidth
                } else if (animationOffset.current > 0) {
                    animationOffset.current -= trackWidth
                }
                track.style.transform = `translateX(${animationOffset.current}px)`
            }

            rafId.current = requestAnimationFrame(step)
        }

        rafId.current = requestAnimationFrame(step)
    }, [])

    // Kill CSS animation, take over with RAF
    const takeover = useCallback(() => {
        const track = trackRef.current
        if (!track) return
        if (rafId.current === null) {
            // First takeover — read current CSS position
            animationOffset.current = getComputedTranslateX()
            track.style.animation = 'none'
        }
        startRAF()
    }, [startRAF])

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true
        isPaused.current = true
        setDragging(true)
        startX.current = e.clientX
        dragStartOffset.current = animationOffset.current
        takeover()
    }, [takeover])

    const onMouseEnter = useCallback(() => {
        if (!isDragging.current) {
            isPaused.current = true
            takeover()
        }
    }, [takeover])

    const onMouseLeave = useCallback(() => {
        if (!isDragging.current) {
            isPaused.current = false
        }
    }, [])

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return
            const dx = e.clientX - startX.current
            animationOffset.current = dragStartOffset.current + dx
        }

        const onMouseUp = () => {
            if (!isDragging.current) return
            isDragging.current = false
            isPaused.current = false
            setDragging(false)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    // Touch
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        isDragging.current = true
        isPaused.current = true
        setDragging(true)
        startX.current = e.touches[0].clientX
        dragStartOffset.current = animationOffset.current
        takeover()
    }, [takeover])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current) return
        const dx = e.touches[0].clientX - startX.current
        animationOffset.current = dragStartOffset.current + dx
    }, [])

    const onTouchEnd = useCallback(() => {
        isDragging.current = false
        isPaused.current = false
        setDragging(false)
    }, [])

    // Start RAF on mount (always running, speed controlled internally)
    useEffect(() => {
        takeover()
        return () => stopRAF()
    }, [takeover, stopRAF])

    return (
        <div
            className="marquee-outer"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
            <div ref={trackRef} className="marquee-track">
                {items.map((review, index) => (
                    <div
                        key={index}
                        className={`testimonial-card${hoveredIndex === index ? ' testimonial-card--dark' : ''}`}
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