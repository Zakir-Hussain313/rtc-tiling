import Link from "next/link";
import '../../styles/About/AboutOurStory.css'
import Image from "next/image";
import NumBox from "@/Components/NumBox";
import fallbackImage from '../../assets/images/Hero-background.webp'
import { getAboutImages } from 'lib/getAboutImages';
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";
import { optimizeCloudinaryUrl } from 'lib/cloudinaryUtils';
import { getStats } from "lib/getStats";

export default async function OurStory() {
    const [images, stats] = await Promise.all([
        getAboutImages(),
        getStats(),
    ])
    const stat = stats[0]

    const image1Url = images.find((img) => img.id === 1)?.url ?? null;
    const image2Url = images.find((img) => img.id === 2)?.url ?? null;

    return (
        <main className="about-main-section">
            <FadeIn as="section" className="about-first-section" delay={100}>
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link href={'/'}>Home</Link>
                        <span> / </span>
                        <Link href={'/about'}>About Us</Link>
                    </div>
                    <h1>PRECISION IN EVERY PROJECT</h1>
                </div>
                <div className="first-section-child-2">
                    {stat && <CountUp stat={stat} />}
                </div>
            </FadeIn>

            <FadeIn as="section" className="about-second-section" delay={150}>
                <div className="second-section-child-1">
                    <div className="second-section-image-box">
                        <Image
                            src={image1Url ? optimizeCloudinaryUrl(image1Url, 800) : fallbackImage}
                            alt="RTC Tiling — our story image 1"
                            fill
                            className="img"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    <div className="second-section-image-box second-image-box">
                        <Image
                            src={image2Url ? optimizeCloudinaryUrl(image2Url, 800) : fallbackImage}
                            alt="RTC Tiling — our story image 2"
                            fill
                            className="img"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>

                <div className="second-section-child-2">
                    <h1>OUR STORY</h1>
                    <p>
                        Built on generations of craftsmanship, RTC is a family owned business specialising in tiling, waterproofing, screeding, renovations, building extensions and maintenance services. With over <span className="text-[#c4a473]">20 years of experience</span> and over four decades of family industry expertise, we proudly service projects across NSW, delivering quality workmanship, reliability and lasting results for residential, commercial and industrial clients.
                    </p>
                </div>
            </FadeIn>

            <FadeIn as="section" className="about-third-section" delay={200}>
                <NumBox stats={stats} />
            </FadeIn>
        </main>
    );
}