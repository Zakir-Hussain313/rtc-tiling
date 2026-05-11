'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface MarqueeTrackProps {
    children: React.ReactNode[]   // each child is one card (already tripled by the parent)
    speed?: number                 // px/sec, default 40
    outerClassName?: string
    trackClassName?: string
    itemCount: number              // total items passed in (after tripling)
}

const DEFAULT_SPEED = 40

export default function MarqueeTrack({
    children,
    speed = DEFAULT_SPEED,
    outerClassName = 'marquee-outer',
    trackClassName = 'marquee-track',
    itemCount,
}: MarqueeTrackProps) {
    const [dragging, setDragging] = useState(false)

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
                animationOffset.current -= (speed * delta) / 1000
            }

            const track = trackRef.current
            if (track) {
                const trackWidth = track.scrollWidth / 3
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
    }, [speed])

    const takeover = useCallback(() => {
        const track = trackRef.current
        if (!track) return
        if (rafId.current === null) {
            animationOffset.current = getComputedTranslateX()
            track.style.animation = 'none'
        }
        startRAF()
    }, [startRAF])

    // Mouse
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
            animationOffset.current = dragStartOffset.current + (e.clientX - startX.current)
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
        animationOffset.current = dragStartOffset.current + (e.touches[0].clientX - startX.current)
    }, [])

    const onTouchEnd = useCallback(() => {
        isDragging.current = false
        isPaused.current = false
        setDragging(false)
    }, [])

    useEffect(() => {
        takeover()
        return () => stopRAF()
    }, [takeover, stopRAF])

    return (
        <div
            className={outerClassName}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
            <div ref={trackRef} className={trackClassName}>
                {children}
            </div>
        </div>
    )
}