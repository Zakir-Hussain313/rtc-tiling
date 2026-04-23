import Link from "next/link";
import '../../styles/Services/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";

export default function ServicesPageIntro() {
    return (
        <main>
            <FadeIn as="section" className="pageIntro-first-section" delay={100}>
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link href={'/'}>Home</Link>
                        <span> / </span>
                        <Link href={'/services'}>Services</Link>
                    </div>
                    <h1>Excellence in Every Detail.</h1>
                </div>
                <div className="first-section-child-2">
                    <CountUp value={92} symbol="%" label="Client Retention" />
                </div>
            </FadeIn>
        </main>
    )
}