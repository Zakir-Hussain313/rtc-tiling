import Link from "next/link";
import '../../styles/About/AboutOurStory.css'
import Image from "next/image";
import NumBox from "@/Components/NumBox";
import fallbackImage from '../../assets/images/Hero-background.webp'
import { getAboutImages } from 'lib/getAboutImages';

export default async function OurStory() {
    const images = await getAboutImages();

    const image1Url = images.find((img) => img.id === 1)?.url ?? null;
    const image2Url = images.find((img) => img.id === 2)?.url ?? null;

    return (
        <main className="about-main-section">
            <section className="about-first-section">
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link href={'/'}>Home</Link>
                        <span> / </span>
                        <Link href={'/about'}>About Us</Link>
                    </div>
                    <h1>PRECISION IN EVERY <br />PROJECT</h1>
                </div>
                <div className="first-section-child-2">
                    <h1>100<span>%</span></h1>
                    <p>Customer Satisfaction</p>
                </div>
            </section>
            <section className="about-second-section">
                <div className="second-section-child-1">
                    <div className="second-section-image-box">
                        <Image
                            src={image1Url ?? fallbackImage}
                            alt="RTC Tiling — our story image 1"
                            fill
                            className="img"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    <div className="second-section-image-box second-image-box">
                        <Image
                            src={image2Url ?? fallbackImage}
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
                        With years of experience in the tiling industry.
                        <span> RTC is dedicated to delivering exceptional craftsmanship and beautiful results.</span>{" "}
                        Our team of skilled professionals is passionate about creating stunning tile installations
                        that stand the test of time. From kitchens and bathrooms to floors and backsplashes,
                        we take pride in transforming your spaces with precision and care.
                    </p>
                </div>
            </section>

            <section className="about-third-section">
                <NumBox />
            </section>
        </main>
    );
}