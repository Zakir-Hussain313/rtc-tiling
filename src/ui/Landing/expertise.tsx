// src/ui/Landing/Expertise.tsx

import Image from "next/image";
import Link from "next/link";
import "../../styles/Landing/expertise.css";
import fallbackImage from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import Mainbutton from "@/Components/Mainbutton";
import { connectDB } from "lib/mongodb";
import Service from "models/Service";
import { unstable_cache } from 'next/cache';
import { optimizeCloudinaryUrl } from "lib/cloudinaryUtils";
import MarqueeTrack from "@/Components/MarqueeTrack"; // ← adjust path to wherever you place it

type ServiceDoc = {
    _id: string;
    title: string;
    images: string[];
    slug: string;
};

const getServices = unstable_cache(
    async () => {
        await connectDB();
        const services = await Service.find(
            {},
            { title: 1, images: 1, slug: 1 }
        ).sort({ order: 1, createdAt: -1 }).lean();
        return services as unknown as ServiceDoc[];
    },
    ['services-data'],
    { revalidate: 60, tags: ['services-data'] }
);

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
                        Transform your home with renovation styles that suit your taste — from modern simplicity to premium luxury finishes. Create a space that feels truly yours.
                    </p>
                </section>

                {items.length > 0 ? (
                    <MarqueeTrack
                        outerClassName="expertise-marquee-outer"
                        trackClassName="expertise-marquee-track"
                        speed={40}
                        itemCount={items.length}
                    >
                        {items.map((service, index) => {
                            const slug = service.slug.startsWith('/services/')
                                ? service.slug.replace('/services/', '')
                                : service.slug;

                            return (
                                <Link
                                    key={`${service._id}-${index}`}
                                    href={`/services/${slug}`}
                                    className="service-card"
                                    draggable={false}
                                >
                                    <div className="image-slider-container">
                                        <Image
                                            src={service.images?.length > 0 ? optimizeCloudinaryUrl(service.images[0], 600) : fallbackImage}
                                            alt={service.title}
                                            fill
                                            className="card-image object-cover"
                                            style={{ borderRadius: "30px" }}
                                            sizes="(max-width: 768px) 50vw, 300px"
                                            draggable={false}
                                        />
                                    </div>
                                    <h3 className="card-label">{service.title}</h3>
                                </Link>
                            );
                        })}
                    </MarqueeTrack>
                ) : (
                    <p style={{ padding: "2rem", opacity: 0.5, textAlign: "center" }}>
                        No services available yet.
                    </p>
                )}

                <div className="expertise-button-section flex justify-center">
                    <Mainbutton
                        data="All Services"
                        href="/services"
                        fontSize="clamp(15px, 2vw, 20px)"
                        padding="5px 5px 5px 20px"
                        arrowSize="clamp(38px, 4vw, 50px)"
                        backgroundColor="#fff"
                        textColor="#111"
                        border="2px solid #444"
                        borderOnHover="2px solid transparent"
                        hoverBubbleColor="#4d3d2d"
                        hoverTextColor="white"
                    />
                </div>
            </section>
        </main>
    );
}