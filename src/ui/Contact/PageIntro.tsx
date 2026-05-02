import Link from "next/link";
import '../../styles/Contact/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";

export default function ContactPageIntro() {
    return (
        <section className="contactIntro-main-section">
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
                        <CountUp statIndex={3}/>
                    </div>
                </section>
            </FadeIn>
        </section>
    )
}