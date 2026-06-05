import "../../styles/Landing/OurStory.css";
import Mainbutton from "@/Components/Mainbutton";
import StoryImageCycler from "./StoryImageCycler";
import FadeIn from "@/Components/FadeIn";
import { unstable_cache } from 'next/cache';
import Link from "next/link";
import About from "../../../models/About";
import { connectDB } from "../../../lib/mongodb";

const getAboutImages = unstable_cache(
    async (): Promise<string[]> => {
        await connectDB();
        const about = await About.findOne({}, { images: 1 }).lean();
        if (!about) return [];
        return (about as unknown as { images: { url: string }[] }).images
            .map((s) => s.url)
            .filter(Boolean);
    },
    ['about-images'],
    { revalidate: 60, tags: ['about-images'] }
);

export default async function OurStory() {
    const images = await getAboutImages();

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
                            <Link href="https://maps.app.goo.gl/G9GbPG4CrkNN9ZE19?g_st=aw" target="_blank" aria-label="Google">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </Link>
                            <Link href="https://www.facebook.com/share/1HZZjL6FTy/?mibextid=wwXIfr" aria-label="Facebook" target="_blank">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                                </svg>
                            </Link>
                            <Link href="https://www.instagram.com/rtcprojectsau/" target="_blank" aria-label="Instagram">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <FadeIn as="div" className="textCol" delay={200}>
                        <p className="body">
                           As a family-owned business backed by more than <span className="text-[#c4a473]">four decades</span> of industry expertise, RTC combines craftsmanship, reliability and professional service on every project.
                        </p>
                        <Mainbutton
                            data="About Us"
                            href="/about"
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
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}