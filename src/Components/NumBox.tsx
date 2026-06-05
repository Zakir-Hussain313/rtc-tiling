'use client'

import { useEffect, useRef, useState } from 'react'
import '../styles/NumBox.css'
import { StatItem } from '../../lib/getStats'

export default function NumBox({ stats }: { stats: StatItem[] }) {
    const [counts, setCounts] = useState<number[]>(stats.map(() => 0))
    const [animated, setAnimated] = useState(false)
    const statsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!stats.length) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated) {
                    setAnimated(true)
                    stats.forEach((stat, index) => {
                        let start = 0
                        const duration = 2000
                        const increment = stat.value / (duration / 30)
                        const interval = setInterval(() => {
                            start += increment
                            if (start >= stat.value) {
                                start = stat.value
                                clearInterval(interval)
                            }
                            setCounts((prev) => {
                                const updated = [...prev]
                                updated[index] = Math.floor(start)
                                return updated
                            })
                        }, 30)
                    })
                    observer.disconnect()
                }
            },
            { threshold: 0, rootMargin: '0px 0px -50px 0px' }
        )
        if (statsRef.current) observer.observe(statsRef.current)
        return () => observer.disconnect()
    }, [stats, animated])

    if (!stats.length) return null

    return (
        <div className="stats-main-container">
            <main className="stats-container" ref={statsRef}>
                {stats.map((stat, i) => (
                    <section className="stats" key={stat.id}>
                        <div className="stats-up">
                            <h1 className="stat-h1">{counts[i]}</h1>
                            <span className="stat-symbol">{stat.symbol}</span>
                        </div>
                        <div className="stats-down">
                            <h1 className="stat-h1">{stat.label}</h1>
                        </div>
                    </section>
                ))}
            </main>
        </div>
    )
}