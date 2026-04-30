import "../../styles/Landing/OurStory.css";
import Mainbutton from "@/Components/Mainbutton";
import { connectDB } from "lib/mongodb";
import Service from "models/Service";
import StoryImageCycler from "./StoryImageCycler";
import FadeIn from "@/Components/FadeIn";
import { unstable_noStore as noStore } from 'next/cache';

async function getServiceImages(): Promise<string[]> {
    noStore();
    try {
        await connectDB();
        const services = await Service.find(
            { image: { $ne: "" } },
            { image: 1 }
        )
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return services
            .map((s) => (s as unknown as { image: string }).image)
            .filter(Boolean);
    } catch (err) {
        console.error("[OurStory] Failed to fetch images", err);
        return [];
    }
}

export default async function OurStory() {
    const images = await getServiceImages();

    return (
        <section className="section">
            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    {/* Desktop clip */}
                    <clipPath id="storyClip" clipPathUnits="objectBoundingBox">
                        <path d="
    M 0.08,0
    Q 0,0 0,0.08
    L 0,0.92
    Q 0,1 0.08,1
    L 0.50,1
    Q 0.54,1 0.55,0.94
    L 0.55,0.86
    Q 0.55,0.80 0.61,0.80
    L 0.92,0.80
    Q 1,0.80 1,0.72
    L 1,0.07
    Q 1,0 0.92,0
    Z
  " />
                    </clipPath>

                    {/* Tablet clip */}
                    <clipPath id="storyClipTablet" clipPathUnits="objectBoundingBox">
                        <path d="
    M 0.07,0
    Q 0,0 0,0.07
    L 0,0.93
    Q 0,1 0.07,1
    L 0.60,1
    Q 0.64,1 0.65,0.96
    L 0.65,0.87
    Q 0.65,0.80 0.70,0.80
    L 0.92,0.80
    Q 1,0.80 1,0.64
    L 1,0.07
    Q 1,0 0.93,0
    Z
  " />
                    </clipPath>

                    {/* Mobile clip */}
                    <clipPath id="storyClipMobile" clipPathUnits="objectBoundingBox">
                        <path d="
  M 0.08,0
  Q 0,0 0,0.08
  L 0,0.92
  Q 0,1 0.08,1
  L 0.60,1
  Q 0.64,1 0.65,0.94
  L 0.65,0.87
  C 0.65,0.87 0.65,0.77 0.69,0.77
  L 0.92,0.77
  Q 1,0.77 1,0.67
  L 1,0.08
  Q 1,0 0.92,0
  Z
" />
                    </clipPath>

                    {/* Medium mobile clip - 640px to 510px */}
                    <clipPath id="storyClipMedium" clipPathUnits="objectBoundingBox">
                        <path d="
M 0.08,0
Q 0,0 0,0.08
L 0,0.92
Q 0,1 0.08,1
L 0.57,1
Q 0.64,1 0.65,0.94
L 0.65,0.82
C 0.65,0.84 0.65,0.77 0.69,0.77
L 0.92,0.77
Q 1,0.77 1,0.65
L 1,0.08
Q 1,0 0.92,0
Z
" />
                    </clipPath>

                    {/* Small mobile clip */}
                    <clipPath id="storyClipSmall" clipPathUnits="objectBoundingBox">
                        <path d="
    M 0.08,0
    Q 0,0 0,0.08
    L 0,0.92
    Q 0,1 0.08,1
    L 0.51,1
    Q 0.61,1 0.61,0.94
    L 0.61,0.85
    C 0.61,0.85 0.61,0.78 0.65,0.78
    L 0.92,0.78
    Q 1,0.78 1,0.62
    L 1,0.08
    Q 1,0 0.92,0
    Z
  " />
                    </clipPath>
                    {/* Extra Small mobile clip */}
                    <clipPath id="storyClipExtraSmall" clipPathUnits="objectBoundingBox">
                        <path d="
    M 0.08,0
    Q 0,0 0,0.08
    L 0,0.92
    Q 0,1 0.08,1
    L 0.51,1
    Q 0.58,1 0.58,0.94
    L 0.58,0.87
    C 0.58,0.87 0.58,0.80 0.62,0.80
    L 0.92,0.80
    Q 1,0.80 1,0.62
    L 1,0.08
    Q 1,0 0.92,0
    Z
  " />
                    </clipPath>
                </defs>
            </svg>

            <div className="section-inner">
                <FadeIn as="h2" className="heading" delay={100}>OUR STORY</FadeIn>

                <div className="card">
                    <div className="imageCol">

                        <StoryImageCycler images={images} />

                        <div className="socials">
                            <a href="#" aria-label="X">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Facebook">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <FadeIn as="div" className="textCol" delay={200}>
                        <p className="body">
                            SPECIALISING IN PROFESSIONAL{" "}
                            <span className="highlight">TILING SOLUTIONS</span>, WE
                            COMBINE SKILL, EXPERIENCE, AND PREMIUM MATERIALS TO CREATE CLEAN,
                            DURABLE FINISHES YOU&apos;LL LOVE.
                        </p>
                        <Mainbutton
                            data="About Us"
                            href="/about"
                            fontSize="clamp(15px, 2vw, 20px)"
                            padding="5px 5px 5px 20px"
                            arrowSize="clamp(38px, 4vw, 50px)"
                            hoverBubbleColor="#4d3d2d"
                        />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}