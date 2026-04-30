import Mainbutton from "@/Components/Mainbutton";
import '../../styles/Contact/ContactCTA.css'
import FadeIn from "@/Components/FadeIn";

export default function ContactCTA() {
    return (
        <div className="ContactCTA-wrapper">
            <FadeIn as={'section'} delay={100} className="ContactCTA-main-section">
                <h1>Let&apos;s Explore Our Recent Projects</h1>
                <p>See how our tiling work transforms real spaces.</p>
                <div className="ContactCTA-button">
                    <Mainbutton
                        data="View Our Projects"
                        href="/projects"
                        fontSize="clamp(15px, 2vw, 20px)"
                        padding="5px 5px 5px 20px"
                        arrowSize="clamp(38px, 4vw, 50px)"
                        hoverBubbleColor="#4d3d2d"
                    />
                </div>
            </FadeIn>
        </div>
    )
}