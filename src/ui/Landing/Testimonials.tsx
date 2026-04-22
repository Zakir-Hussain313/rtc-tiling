
import "../../styles/Landing/Testimonials.css"
import TestimonialsTrack from "./TestimonialStrack"
import avatar from "../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg"

type Review = {
    name: string
    role: string
    image: string
    review: string
    rating?: number
}

const FALLBACK_REVIEWS: Review[] = [
    {
        name: "John Doe",
        role: "Google Review",
        image: avatar.src,
        review: "Absolutely loved working with this team. They transformed our office space into something magical!",
        rating: 5,
    },
    {
        name: "Jane Smith",
        role: "Google Review",
        image: avatar.src,
        review: "Professional, creative, and attentive. Highly recommend their tiling services.",
        rating: 5,
    },
    {
        name: "Alice Johnson",
        role: "Google Review",
        image: avatar.src,
        review: "The attention to detail and quality of work is unmatched. Totally satisfied with the result!",
        rating: 5,
    },
]

async function getGoogleReviews(): Promise<Review[]> {
    const apiKey  = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey || !placeId) {
        console.warn('[Testimonials] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — using fallback reviews.')
        return FALLBACK_REVIEWS
    }

    try {
        const res = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&languageCode=en`,
            {
                headers: {
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'reviews',
                },
                next: { revalidate: 86400 },
            }
        )

        if (!res.ok) {
            console.error('[Testimonials] Google Places API error:', res.status, await res.text())
            return FALLBACK_REVIEWS
        }

        const data = await res.json()
        const raw: any[] = data.reviews ?? []

        if (!raw.length) return FALLBACK_REVIEWS

        const mapped: Review[] = raw
            .filter((r) => r.rating >= 4)
            .map((r) => ({
                name:   r.authorAttribution?.displayName  ?? 'Anonymous',
                role:   'Google Review',
                image:  r.authorAttribution?.photoUri
                            ? `${r.authorAttribution.photoUri}=s80-c`
                            : avatar.src,
                review: r.text?.text ?? '',
                rating: r.rating,
            }))
            .filter((r) => r.review.length > 20)

        return mapped.length ? mapped : FALLBACK_REVIEWS
    } catch (err) {
        console.error('[Testimonials] Failed to fetch Google Reviews:', err)
        return FALLBACK_REVIEWS
    }
}

export default async function Testimonials() {
    const reviews = await getGoogleReviews()

    const items = [...reviews, ...reviews, ...reviews]

    return (
        <main className="testimonials-section">
            <section>
                <section className="testi-title-container">
                    <h1>TESTIMONIALS</h1>
                    <p>Trusted by Homeowners &amp; Builders</p>
                </section>

                <TestimonialsTrack items={items} />
            </section>
        </main>
    )
}