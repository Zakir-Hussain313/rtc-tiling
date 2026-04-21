import OurStory from "./AboutOurStory";
import OurCraft from "./OurCraft";
import WhyChooseUs from "./WhyChooseUs";
import '../../styles/About/About.css'

export default function AboutComponent() {
    return (
       <main className="about-main-main-section">
            <OurStory />
            <OurCraft />
            <WhyChooseUs />
       </main>
    )
}