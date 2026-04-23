import Mainbutton from "@/Components/Mainbutton";
import '../../styles/Contact/ContactCTA.css'
import FadeIn from "@/Components/FadeIn";

export default function ContactCTA() {
    return (
        <FadeIn as={'section'} delay={100} className="ContactCTA-main-section">
            <h1>Let&apos;s Explore Our Recent Projects</h1>
            <p>See how our tiling work transforms real spaces.</p>
            <div className="ContactCTA-button">
                <Mainbutton
                    data="View Our Projects"
                    href="/projects"
                    fontSize="clamp(16px, 2.5vw, 25px)"
                    padding="clamp(7px, 0.4vw, 7px) clamp(7px, 0.4vw, 5px) clamp(7px, 0.4vw, 7px) clamp(22px, 2vw, 30px)"
                    arrowSize="clamp(38px, 4vw, 55px)"
                />
            </div>
        </FadeIn>
    )
}