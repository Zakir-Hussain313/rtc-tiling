
import Hero from "./Hero";
import Stats from "./Stats";
import Expertise from "./expertise";
import OurStory from "./OurStory";
import Featured from "./featured";
import "../../styles/Home.css";
import Testimonials from "./Testimonials";

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Stats />
      <Expertise />
      <OurStory />
      <Featured />
      <Testimonials />
    </div>
  );
}