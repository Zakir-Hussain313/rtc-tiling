'use client'

import { useState } from 'react'
import Image from 'next/image'
import { optimizeCloudinaryUrl } from 'lib/cloudinaryUtils'
import MarqueeTrack from '@/Components/MarqueeTrack' // adjust path if needed

type Review = {
    name: string
    role: string
    image: string
    review: string
    rating?: number
}

export default function TestimonialsTrack({ items }: { items: Review[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <MarqueeTrack
            outerClassName="marquee-outer"
            trackClassName="marquee-track"
            speed={40}
            itemCount={items.length}
        >
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
        </MarqueeTrack>
    )
}