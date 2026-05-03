'use client'

import { useState } from 'react'
import Image from 'next/image'
import { optimizeCloudinaryUrl } from 'lib/cloudinary'

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

    return (
        <div
            className="marquee-outer"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className={`marquee-track${paused ? ' marquee-track--paused' : ''}`}>
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
                                <Image
                                    src={optimizeCloudinaryUrl(review.image, 100)}
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