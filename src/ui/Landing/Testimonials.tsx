import "../../styles/Landing/Testimonials.css"
import TestimonialsTrack from "./TestimonialStrack"
import avatar from "../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg"
import FadeIn from "@/Components/FadeIn"
import { connectDB } from 'lib/mongodb'
import Testimonial from 'models/Testimonial'

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

async function getTestimonials(): Promise<Review[]> {
    try {
        await connectDB();
        const data = await Testimonial.find({}).sort({ order: 1, createdAt: -1 }).lean();
        console.log('[Testimonials] fetched:', data.length, JSON.stringify(data));
        if (!data.length) return FALLBACK_REVIEWS;
        return data.map((t: any) => ({
            name: t.name,
            role: t.role,
            image: t.image || avatar.src,
            review: t.review,
            rating: t.rating,
        }));
    } catch (err) {
        console.error('[Testimonials] DB fetch failed:', err);
        return FALLBACK_REVIEWS;
    }
}

export default async function Testimonials() {
    const reviews = await getTestimonials()
    const items = [...reviews, ...reviews, ...reviews]

    return (
        <main className="testimonials-section">
            <section>
                <FadeIn as={'section'} className="testi-title-container" delay={300}>
                    <h1>TESTIMONIALS</h1>
                    <p>Trusted by Homeowners &amp; Builders</p>
                </FadeIn>
                <TestimonialsTrack items={items} />
            </section>
        </main>
    )
}