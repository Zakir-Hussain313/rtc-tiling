import Link from "next/link";
import '../../styles/Projects/PageIntro.css'
import CountUp from "@/Components/CountUp";

export default function ProjectsPageIntro() {
    return (
        <main>
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
                            href={'/projects'}
                        >
                            Projects
                        </Link>
                    </div>
                    <h1>Every Tile. Perfectly Placed.</h1>
                </div>
                <div className="first-section-child-2">
                    <CountUp value={99} symbol="%" label="Projects Completed" />
                </div>
            </section>
        </main>
    )
}