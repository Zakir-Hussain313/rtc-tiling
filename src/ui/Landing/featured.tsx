import FadeIn from "@/Components/FadeIn"
import "../../styles/Landing/featured.css"
import FeaturedGrid from "@/Components/FeaturedGrid"
import Mainbutton from "@/Components/Mainbutton"

export default function Featured() {
    return (
        <main className="featured-main-section">
            <section className="featured-second-main-section">
                <FadeIn as="section" className="title-section" delay={100}>
                    <h1>FEATURED</h1>
                    <p>Crafted Surfaces, Captured Moments</p>
                </FadeIn>
                <FeaturedGrid />
                <FadeIn as="div" className="button-section" delay={200}>
                    <Mainbutton
                        data="View Gallery"
                        href="/projects"
                        backgroundColor="white"
                        textColor="black"
                        border="2px solid #777"
                        fontSize="clamp(20px, 2.5vw, 25px)"
                        arrowSize="clamp(38px, 4vw, 50px)"
                    />
                </FadeIn>
            </section>
        </main >
    )
}