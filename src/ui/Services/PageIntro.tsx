import Link from "next/link";
import '../../styles/Services/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";
import { getStats } from "lib/getStats";

export default async function ServicesPageIntro() {
    const stats = await getStats()
    const stat = stats[1]
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
                     {stat && <CountUp stat={stat} />}
                </div>
            </FadeIn>
        </main>
    )
}