// src/ui/Landing/Expertise.tsx

import Image from "next/image";
import Link from "next/link";
import "../../styles/Landing/expertise.css";
import fallbackImage from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import Mainbutton from "@/Components/Mainbutton";
import { connectDB } from "lib/mongodb";
import Service from "models/Service";

type ServiceDoc = {
    _id: string;
    title: string;
    image: string;
    slug: string;
};

async function getServices(): Promise<ServiceDoc[]> {
    try {
        await connectDB();
        const services = await Service.find(
            {},
            { title: 1, image: 1, slug: 1 }
        )
            .sort({ order: 1, createdAt: -1 })
            .lean();
        return services as unknown as ServiceDoc[];
    } catch (err) {
        console.error("[Expertise] Failed to fetch services", err);
        return [];
    }
}

export default async function Expertise() {
    const services = await getServices();

    const items = services.length > 0
        ? [...services, ...services, ...services]
        : [];

    return (
        <main className="expertise-main-section">
            <section className="">
                <section className="title-container">
                    <h1>OUR EXPERTISE</h1>
                    <p>
                        Explore a curated range of interior design styles — from clean
                        minimalism to bold luxury. Find the aesthetic that speaks to you.
                    </p>
                </section>

                {items.length > 0 ? (
                    <section className="marquee-outer">
                        <div className="marquee-track">
                            {items.map((service, index) => {
                                // strip any /services/ prefix so we always get a clean slug
                                const slug = service.slug.startsWith('/services/')
                                    ? service.slug.replace('/services/', '')
                                    : service.slug;

                                return (
                                    <Link
                                        key={`${service._id}-${index}`}
                                        href={`/services/${slug}`}
                                        className="service-card"
                                    >
                                        <div className="image-slider-container">
                                            <Image
                                                src={typeof service.image === "string" && service.image !== "" ? service.image : fallbackImage}
                                                alt={service.title}
                                                fill
                                                className="card-image object-cover"
                                                style={{ borderRadius: "30px" }}
                                                sizes="(max-width: 768px) 50vw, 300px"
                                            />
                                        </div>
                                        <h3 className="card-label">{service.title}</h3>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    <p style={{ padding: "2rem", opacity: 0.5, textAlign: "center" }}>
                        No services available yet.
                    </p>
                )}

                <div className="expertise-button-section flex justify-center">
                    <Mainbutton
                        data="All Services"
                        href="/services"
                        backgroundColor="white"
                        textColor="black"
                        hoverBubbleColor="#4d3d2d"
                        border="2px solid #777"
                        fontSize="clamp(20px, 2.5vw, 25px)"
                        arrowSize="clamp(38px, 4vw, 50px)"
                    />
                </div>
            </section>
        </main>
    );
}