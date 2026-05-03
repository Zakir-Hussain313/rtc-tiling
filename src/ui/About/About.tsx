import OurStory from "./AboutOurStory";
import OurCraft from "./OurCraft";
import WhyChooseUs from "../../Components/WhyChooseUs";
import '../../styles/About/About.css'
import ProjectsCTA from "../Projects/ProjectsCTA";

export default function AboutComponent() {
    return (
       <main className="about-main-main-section">
            <OurStory />
            <OurCraft />
            <WhyChooseUs />
            <ProjectsCTA />
       </main>
    )
}