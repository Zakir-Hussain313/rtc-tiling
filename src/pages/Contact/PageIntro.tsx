import Link from "next/link";
import '../../styles/Contact/PageIntro.css'

export default function ContactPageIntro(){
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
                            href={'/contact'}
                        >
                             Contact
                        </Link>
                    </div>
                    <h1>Every Tile. Perfectly Placed.</h1>
                </div>
                <div className="first-section-child-2">
                    <h1>80<span>+</span></h1>
                    <p>Successful Launches</p>
                </div>
            </section>
        </main>
    )
}