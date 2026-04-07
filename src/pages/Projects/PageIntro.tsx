import Link from "next/link";
import '../../styles/Projects/PageIntro.css'

export default function ProjectsPageIntro(){
    return(
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
                    <h1>99<span>%</span></h1>
                    <p>Projects Completed</p>
                </div>
            </section>
        </main>
    )
}