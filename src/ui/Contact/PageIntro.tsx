import Link from "next/link";
import '../../styles/Contact/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";

export default function ContactPageIntro() {
    return (
        <FadeIn as={'section'} delay={100} className="pageIntro-main-section">
            <section className="pageIntro-first-section">
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link
                            href={'/'}
                        >
                            Home
                        </Link>
                        <span> / </span>
                        <Link
                            href={'/contact'}
                        >
                            Contact
                        </Link>
                    </div>
                    <h1>Every Tile. Perfectly Placed.</h1>
                </div>
                <div className="first-section-child-2">
                    <CountUp value={80} symbol="+" label="Successful Launches" />
                </div>
            </section>
        </FadeIn>
    )
}