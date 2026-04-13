import Image from "next/image";
import "../../styles/Landing/Testimonials.css";
import avatar1 from "../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg";
import avatar2 from "../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg";
import avatar3 from "../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg";

export default function Testimonials() {
    const reviews = [
        {
            name: "John Doe",
            role: "CEO, Company X",
            image: avatar1,
            review:
                "Absolutely loved working with this team. They transformed our office space into something magical! Absolutely loved working with this team. They transformed our office space into something magical! Absolutely loved working with this team. They transformed our office space into something magical! Absolutely loved working with this team. They transformed our office space into something magical!",
        },
        {
            name: "Jane Smith",
            role: "Marketing Manager",
            image: avatar2,
            review:
                "Professional, creative, and attentive. Highly recommend their design services.",
        },
        {
            name: "Alice Johnson",
            role: "Freelancer",
            image: avatar3,
            review:
                "The attention to detail and creativity is unmatched. Totally satisfied! Absolutely loved working with this team. They transformed our office space into something magical! Absolutely loved working with this team. They transformed our office space into something magical!",
        },
    ];

    const items = [...reviews, ...reviews, ...reviews];

    return (
        <main className="testimonials-section">
            <section className="title-container">
                <h1>TESTIMONIALS</h1>
                <p>Trusted by Homeowners & Builders</p>
            </section>

            <section className="marquee-outer">
                <div className="marquee-track">
                    {items.map((review, index) => (
                        <div className="testimonial-card" key={index}>
                            <p className="testimonial-review">&quot;{review.review}&quot;</p>
                            <div className="testimonial-footer">
                                <div className="testimonial-image">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        fill
                                        style={{ borderRadius: "50%", objectFit: "cover" }}
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
            </section>
        </main>
    );
}