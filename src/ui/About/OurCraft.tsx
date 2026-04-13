import Image from "next/image"
import "../../styles/About/OurCraft.css"
import image from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Mainbutton from "@/Components/Mainbutton"
import { GiTrowel } from "react-icons/gi"
import { MdDiamond } from "react-icons/md"
import { BsHouseFill } from "react-icons/bs"

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

export default function OurCraft() {
    return (
        <main className="our-craft-main-section">
            <section className="our-craft-heading">
                <h2>OUR CRAFT</h2>
                <h1>
                    <span>**</span>We Build With Precision —{" "}
                    <br />
                    For Homes, Businesses, and Modern Spaces<span>**</span>
                </h1>
            </section>

            <section className="our-craft-section">
                <div className="our-craft-left">
                    <Image
                        src={image}
                        alt="RTC Tiling team"
                        fill
                        className="object-cover rounded-3xl"
                    />
                </div>

                <div className="our-craft-right">
                    {features.map((f, i) => (
                        <div className="our-craft-right-div" key={i}>
                            <div className="our-craft-icon">{f.icon}</div>
                            <div className="our-craft-right-text">
                                <h1>{f.title}</h1>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className="our-craft-btn">
                        <Mainbutton
                            data="View Our Projects"
                            href="/projects"
                            fontSize="clamp(15px, 2vw, 20px)"
                            padding="5px 5px 5px 20px"
                            arrowSize="clamp(38px, 4vw, 50px)"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}