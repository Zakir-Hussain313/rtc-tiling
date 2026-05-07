'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/CountUp.css'
import type { StatItem } from 'lib/getStats'

interface CountUpProps {
    stat: StatItem
    duration?: number
    fontSize?: string
    symbolSize?: string
    labelSize?: string
}

export default function CountUp({
    stat,
    duration = 2000,
    fontSize,
    symbolSize,
    labelSize,
}: CountUpProps) {
    const [count, setCount] = useState(0)
    const [animated, setAnimated] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setAnimated(true)
                    let start = 0
                    const increment = stat.value / (duration / 30)
                    const interval = setInterval(() => {
                        start += increment
                        if (start >= stat.value) {
                            start = stat.value
                            clearInterval(interval)
                        }
                        setCount(Math.floor(start))
                    }, 30)
                    observer.disconnect()
                }
            },
            { threshold: 0, rootMargin: '0px 0px -50px 0px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [stat.value, duration, animated])

    return (
        <div className="countup-wrapper" ref={ref}>
            <div className="countup-number-row">
                <span className="countup-number" style={fontSize ? { fontSize } : undefined}>
                    {count}
                </span>
                {stat.symbol && (
                    <span className="countup-symbol" style={symbolSize ? { fontSize: symbolSize } : undefined}>
                        {stat.symbol}
                    </span>
                )}
            </div>
            {stat.label && (
                <p className="countup-label" style={labelSize ? { fontSize: labelSize } : undefined}>
                    {stat.label}
                </p>
            )}
        </div>
    )
}