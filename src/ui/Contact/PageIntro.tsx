import Link from "next/link";
import '../../styles/Contact/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";
import { getStats } from "../../../lib/getStats";

export default async function ContactPageIntro() {
    const stats = await getStats()
    const stat = stats[3]
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
                        <h1>Let&apos;s Talk about your project</h1>
                    </div>
                    <div className="first-section-child-2">
                        {stat && <CountUp stat={stat} />}
                    </div>
                </section>
            </FadeIn>
        </section>
    )
}