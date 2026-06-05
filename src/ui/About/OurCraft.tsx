import Image from "next/image"
import "../../styles/About/OurCraft.css"
import fallbackImage from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Mainbutton from "@/Components/Mainbutton"
import { GiTrowel } from "react-icons/gi"
import { FaTools } from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import FadeIn from "@/Components/FadeIn"
import { getAboutImages } from "../../../lib/getAboutImages"
import { optimizeCloudinaryUrl } from "../../../lib/cloudinaryUtils"

const features = [
    {
        icon: <GiTrowel />,
        title: "Family Built Experience",
        desc: "As a family-owned business backed by more than four decades of industry expertise, RTC combines craftsmanship, reliability, and professional service on every project.",
    },
    {
        icon: <FaTools />,
        title: "Complete Project Solutions",
        desc: "Specialising in , waterproofing, screeding, renovations, maintenance, and building extensions for residential, commercial, and industrial projects across NSW.",
    },
    {
        icon: <MdVerified />,
        title: "Built for Long Term Results",
        desc: "Using premium materials and industry-proven systems, we deliver clean, durable finishes supported by workmanship warranty coverage where applicable.",
    },
]

export default async function OurCraft() {
    const images = await getAboutImages();
    const craftImageUrl = images.find((img) => img.id === 3)?.url ?? null;

    return (
        <main className="our-craft-main-section">
            <FadeIn className="our-craft-heading" delay={150}>
                <h2>OUR CRAFT</h2>

                <h1>
                    <span>**</span>
                    We Build With Precision —
                    <br />
                    For Homes, Businesses, and Modern Spaces
                    <span>**</span>
                </h1>
            </FadeIn>

            <FadeIn className="our-craft-section" delay={150}>
                <div className="our-craft-left">
                    <Image
                        src={
                            craftImageUrl
                                ? optimizeCloudinaryUrl(craftImageUrl, 800)
                                : fallbackImage
                        }
                        alt="RTC Projects craftsmanship"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <div className="our-craft-right">
                    {features.map((f, i) => (
                        <FadeIn
                            className="our-craft-right-div"
                            key={i}
                            delay={200 + i * 100}
                        >
                            <div className="our-craft-icon">
                                {f.icon}
                            </div>

                            <div className="our-craft-right-text">
                                <h1>{f.title}</h1>
                                <p>{f.desc}</p>
                            </div>
                        </FadeIn>
                    ))}

                    <FadeIn className="our-craft-btn" delay={500}>
                        <Mainbutton
                            data="View Our Projects"
                            href="/projects"
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
            </FadeIn>
        </main>
    )
}