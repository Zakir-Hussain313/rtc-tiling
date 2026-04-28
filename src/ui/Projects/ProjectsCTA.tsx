import Mainbutton from "@/Components/Mainbutton";
import '../../styles/Projects/ProjectsCTA.css'
import FadeIn from "@/Components/FadeIn";

export default function ProjectsCTA() {
    return (
        <div className="projectsCTA-wrapper">
            <section className="projectsCTA-main-section">
                <FadeIn>
                    <h1>let&apos;s work together to transform your space</h1>
                </FadeIn>
                <FadeIn delay={150}>
                    <p>Reach out today, and let&apos;s discuss your tiling project.</p>
                </FadeIn>
                <FadeIn className="projectsCTA-button" delay={300}>
                    <Mainbutton
                        data="Call Now"
                        href="tel:0468 264 894"
                        fontSize="clamp(16px, 2.5vw, 25px)"
                        padding="clamp(7px, 0.4vw, 7px) clamp(7px, 0.4vw, 5px) clamp(7px, 0.4vw, 7px) clamp(22px, 2vw, 30px)"
                        arrowSize="clamp(38px, 4vw, 55px)"
                        hoverBubbleColor="#4d3d2d"
                    />
                </FadeIn>
            </section>
        </div>
    )
}