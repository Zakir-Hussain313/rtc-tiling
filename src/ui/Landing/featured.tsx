import FadeIn from "@/Components/FadeIn"
import "../../styles/Landing/featured.css"
import FeaturedGrid from "@/Components/FeaturedGrid"
import Mainbutton from "@/Components/Mainbutton"
import { getFeaturedProjects } from "../../../lib/getFeaturedProjects";

export default async function Featured() {
    const projects = await getFeaturedProjects();

    return (
        <main className="featured-main-section">
            <section className="featured-second-main-section">
                <FadeIn as="section" className="title-section" delay={100}>
                    <h1>FEATURED</h1>
                    <p>Crafted Spaces, Captured Moments</p>
                </FadeIn>
                <FeaturedGrid projects={projects} />
                <FadeIn as="div" className="button-section" delay={200}>
                    <Mainbutton
                        data="View Projects"
                        href="/projects"
                        fontSize="clamp(15px, 2vw, 20px)"
                        padding="5px 5px 5px 20px"
                        arrowSize="clamp(38px, 4vw, 50px)"
                        backgroundColor="#fff"
                        textColor="#111"
                        border="2px solid #444"
                        borderOnHover="2px solid transparent"
                        hoverBubbleColor="#4d3d2d"
                        hoverTextColor="white"
                    />
                </FadeIn>
            </section>
        </main>
    )
}