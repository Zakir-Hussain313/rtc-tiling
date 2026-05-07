
import Hero from "./Hero";
import Stats from "./Stats";
import Expertise from "./expertise";
import OurStory from "./OurStory";
import Featured from "./featured";
import "../../styles/Landing/Home.css";
import Testimonials from "./Testimonials";
import WhyChooseUs from "@/Components/WhyChooseUs";

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Stats />
      <Expertise />
      <WhyChooseUs />
      <OurStory />
      <Featured />
      <Testimonials />
    </div>
  );
}