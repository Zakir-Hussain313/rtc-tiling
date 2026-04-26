import Mainbutton from "@/Components/Mainbutton";
import FadeIn from "@/Components/FadeIn";
import '../../styles/Services/ServicesCTA.css'

export default function ServicesCTA() {
    return (
        <FadeIn as="main" className="ServicesCTA-main-section" delay={100}>
            <h1>let&apos;s work together to transform your space</h1>
            <p>Reach out today, and let&apos;s discuss your tiling project.</p>
            <div className="ServicesCTA-button">
                <Mainbutton
                    data="Call Now"
                    href="tel:0468 264 894"
                    fontSize="clamp(16px, 2.5vw, 25px)"
                    padding="clamp(7px, 0.4vw, 7px) clamp(7px, 0.4vw, 5px) clamp(7px, 0.4vw, 7px) clamp(22px, 2vw, 30px)"
                    arrowSize="clamp(38px, 4vw, 55px)"
                    hoverBubbleColor="#4d3d2d"
                />
            </div>
        </FadeIn>
    )
}