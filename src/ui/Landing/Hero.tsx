import "../../styles/Landing/Hero.css";
import Image from "next/image";
import heroBackground from "../../assets/images/Hero-background.webp";
import google from "../../assets/images/Google.webp";
import facebook from "../../assets/images/Facebook.webp";
import trustpilot from "../../assets/images/trustpilot.webp";
import star from "../../assets/icons/star.svg";
import Link from "next/link";
import { connectDB } from "lib/mongodb";
import Hero from "models/Hero";
import FadeIn from "@/Components/FadeIn";
import { unstable_noStore as noStore } from 'next/cache';

type HeroDoc = {
    backgroundImage: string | null;
    headline: string | null;
    subheading: string | null;
    overlayOpacity: number | null;
};


async function getHeroData(): Promise<HeroDoc> {
    noStore();
    try {
        await connectDB();
        const hero = await Hero.findOne().lean();
        return (hero as unknown as HeroDoc) ?? {};
    } catch (err) {
        console.error('[Hero] Failed to fetch hero data', err);
        return { backgroundImage: null, headline: null, subheading: null, overlayOpacity: null };
    }
}

async function HeroSection() {
    const hero = await getHeroData();

    const bgImage = hero.backgroundImage ?? heroBackground.src;
    const headline = hero.headline?.trim() || 'Redefining Your Surfaces';
    const overlayOpacity = (hero.overlayOpacity ?? 40) / 100;

    return (
        <section className="hero">
            <div className="hero-grid">

                {/* Background Image */}
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div
                    className="hero-overlay"
                    style={{ opacity: overlayOpacity }}
                />

                <FadeIn as="div" className="hero-content" delay={200}>
                    <h1 className="hero-text">
                        {headline}
                    </h1>

                    <Link href="tel:0468264894" className="hero-button">
                        Call now: 0415 456 215
                    </Link>

                    <div className="hero-ratings">
                        <div className="hero-left">
                            <Image className="hero-icons" src={google} alt="Google icon" />
                            <Image className="hero-icons" src={facebook} alt="Facebook icon" />
                            <Image className="hero-icons" src={trustpilot} alt="Trustpilot icon" />
                        </div>
                        <div className="hero-right">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Image key={i} src={star} alt="star" className="star" />
                                ))}
                            </div>
                            <div className="rating-text">
                                <span>3K+ User Reviews</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </section>
    );
}

export default HeroSection;