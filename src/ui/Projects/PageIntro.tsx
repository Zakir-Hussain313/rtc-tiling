import Link from "next/link";
import '../../styles/Projects/PageIntro.css'
import CountUp from "@/Components/CountUp";
import FadeIn from "@/Components/FadeIn";

export default function ProjectsPageIntro() {
    return (
        <section className="projectsIntro-main-section">
            <FadeIn as={'section'} delay={100} className="pageIntro-first-section">
                <div className="first-section-child-1">
                    <div className="bread-crumb">
                        <Link
                            href={'/'}
                        >
                            Home
                        </Link>
                        <span> / </span>
                        <Link
                            href={'/projects'}
                        >
                            Projects
                        </Link>
                    </div>
                    <h1>Every Tile. Perfectly Placed.</h1>
                </div>
                <div className="first-section-child-2">
                    <CountUp statIndex={2} />
                </div>
            </FadeIn>
        </section>
    )
}