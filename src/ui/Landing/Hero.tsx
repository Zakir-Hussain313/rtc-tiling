import "../../styles/Landing/Hero.css";
import Image from "next/image";
import heroBackground from "../../assets/images/Hero-background.webp";
import google from "../../assets/images/Google.webp";
import facebook from "../../assets/images/Facebook.webp";
import instagram from '../../assets/images/instagram.jpg';
import star from "../../assets/icons/star.svg";
import Link from "next/link";
import { connectDB } from "lib/mongodb";
import Hero from "models/Hero";
import FadeIn from "@/Components/FadeIn";
import { unstable_cache } from 'next/cache';

type HeroDoc = {
    backgroundImage: string | null;
    headline: string | null;
    subheading: string | null;
    overlayOpacity: number | null;
};

const getHeroData = unstable_cache(
    async () => {
        await connectDB();
        const hero = await Hero.findOne().lean();
        return (hero as unknown as HeroDoc) ?? {};
    },
    ['hero-data'],
    { revalidate: 3600 }
);

async function HeroSection() {
    const hero = await getHeroData();

    const headline = hero.headline?.trim() || 'Redefining Your Surfaces';
    const overlayOpacity = (hero.overlayOpacity ?? 40) / 100;

    return (
        <section className="hero">
            <div className="hero-grid">

                {hero.backgroundImage ? (
                    <Image
                        src={hero.backgroundImage}
                        alt="Hero background"
                        fill
                        priority
                        className="hero-bg"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <Image
                        src={heroBackground}
                        alt="Hero background"
                        fill
                        priority
                        placeholder="blur"
                        className="hero-bg"
                        style={{ objectFit: 'cover' }}
                    />
                )}

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
                            <div className="hero-icon-wrap">
                                <Image src={google} alt="Google" fill style={{ objectFit: 'contain' }} />
                            </div>
                            <div className="hero-icon-wrap">
                                <Image src={facebook} alt="Facebook" fill style={{ objectFit: 'contain' }} />
                            </div>
                            <div className="hero-icon-wrap">
                                <Image src={instagram} alt="Instagram" fill style={{ objectFit: 'contain' }} />
                            </div>
                        </div>
                        <div className="hero-right">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="star-wrap">
                                        <Image src={star} alt="" fill style={{ objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                            <div className="rating-text">
                                <span>Full User Reviews</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </section>
    );
}

export default HeroSection;