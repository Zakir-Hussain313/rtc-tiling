import Image from "next/image"
import "../../styles/About/OurCraft.css"
import fallbackImage from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Mainbutton from "@/Components/Mainbutton"
import { GiTrowel } from "react-icons/gi"
import { MdDiamond } from "react-icons/md"
import { BsHouseFill } from "react-icons/bs"
import { getAboutImages } from 'lib/getAboutImages';
import FadeIn from "@/Components/FadeIn"

const features = [
    {
        icon: <GiTrowel />,
        title: "Premium Craftsmanship",
        desc: "We combine skilled workmanship with attention to detail to deliver flawless, long-lasting tile finishes in every project.",
    },
    {
        icon: <MdDiamond />,
        title: "Material-Driven Quality",
        desc: "From high-grade tiles to advanced installation methods, we use only trusted, industry-leading materials for durability and elegance.",
    },
    {
        icon: <BsHouseFill />,
        title: "Designed For Everyday Living",
        desc: "Our solutions balance beauty and function — creating clean, stylish spaces that stay strong through daily use.",
    },
]

export default async function OurCraft() {
    const images = await getAboutImages();
    const craftImageUrl = images.find((img) => img.id === 3)?.url ?? null;

    return (
        <main className="our-craft-main-section">
            <FadeIn className="our-craft-heading">
                <h2>OUR CRAFT</h2>
                <h1>
                    <span>**</span>We Build With Precision —{" "}
                    <br />
                    For Homes, Businesses, and Modern Spaces<span>**</span>
                </h1>
            </FadeIn>

            <FadeIn className="our-craft-section" delay={150}>
                <div className="our-craft-left">
                    <Image
                        src={craftImageUrl ?? fallbackImage}
                        alt="RTC Tiling craftsmanship"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <div className="our-craft-right">
                    {features.map((f, i) => (
                        <FadeIn className="our-craft-right-div" key={i} delay={200 + i * 100}>
                            <div className="our-craft-icon">{f.icon}</div>
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
                            hoverBubbleColor="#4d3d2d"
                            textColor="white"
                        />
                    </FadeIn>
                </div>
            </FadeIn>
        </main>
    )
}