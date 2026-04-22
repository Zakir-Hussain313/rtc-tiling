'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

type Review = {
    name: string
    role: string
    image: string
    review: string
    rating?: number
}

export default function TestimonialsTrack({ items }: { items: Review[] }) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [paused, setPaused] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const handleCardEnter = (i: number) => {
        setPaused(true)
        setHoveredIndex(i)
    }

    const handleCardLeave = () => {
        setPaused(false)
        setHoveredIndex(null)
    }

    return (
        <div className="marquee-outer">
            <div
                ref={trackRef}
                className="marquee-track"
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
            >
                {items.map((review, index) => (
                    <div
                        className={`testimonial-card${hoveredIndex === index ? ' testimonial-card--dark' : ''}`}
                        key={index}
                        onMouseEnter={() => handleCardEnter(index)}
                        onMouseLeave={handleCardLeave}
                    >
                        {review.rating && (
                            <div className="testimonial-stars">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                        )}
                        <p className="testimonial-review">&quot;{review.review}&quot;</p>
                        <div className="testimonial-footer">
                            <div className="testimonial-image">
                                <Image
                                    src={review.image}
                                    alt={review.name}
                                    fill
                                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                                />
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