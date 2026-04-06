import Link from "next/link";
import '../../styles/About/AboutOurStory.css'
import Image from "next/image";
import aboutImage1 from '../../assets/images/Hero-background.webp'
import aboutImage2 from '../../assets/images/Hero-background.webp'
import NumBox from "@/Components/NumBox";

export default function OurStory() {
    return (
        <main className="about-main-section">
            <section className="about-first-section">
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link
                            href={'/'}
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href={'/about'}
                        >
                            About Us
                        </Link>
                    </div>
                    <h1>PRECISION IN EVERY PROJECT</h1>
                </div>
                <div className="first-section-child-2">
                    <h1>100<span>%</span></h1>
                    <p>Customer Satisfaction</p>
                </div>
            </section>
            <section className="about-second-section">
                <div className="second-section-child-1">
                    <div className="second-section-image-box">
                        <Image src={aboutImage1} alt="" fill className="img" />
                    </div>
                    <div className="second-section-image-box">
                        <Image src={aboutImage2} alt="" fill className="img" />
                    </div>
                </div>
                <div className="second-section-child-2">
                    <h1>OUR STORY</h1>
                    <p>With years of experience in the tiling industry.<span> RTC is dedicated to delivering exceptional craftsmanship and beautiful results.</span> Our team of skilled professionals is passionate about creating stunning tile installations that stand the test of time. From kitchens and bathrooms to floors and backsplashes, we take pride in transforming your spaces with precision and care.</p>
                </div>
            </section>
            <section className="about-third-section">
                <NumBox />
            </section>
        </main>
    )
}