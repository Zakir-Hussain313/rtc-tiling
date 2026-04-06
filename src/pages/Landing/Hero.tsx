import "../../styles/Landing/Hero.css";
import Image from "next/image";
import heroBackground from "../../assets/images/Hero-background.webp";
import google from "../../assets/images/Google.webp";
import facebook from "../../assets/images/Facebook.webp";
import trustpilot from "../../assets/images/trustpilot.webp";
import star from "../../assets/icons/star.svg";


function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">

        {/* Background Image */}
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${heroBackground.src})` }}
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-text">
            Redefining <br />
            Your Surfaces
          </h1>

          <a href="tel:0468 264 894" className="hero-button">
            Call now: 0415 456 215
          </a>

          <div className="hero-ratings">
            <div className="hero-left">
              <Image className="hero-icons" src={google} alt="Google icon" />
              <Image className="hero-icons" src={facebook} alt="Facebook icon" />
              <Image className="hero-icons" src={trustpilot} alt="Trustpilot icon" />
            </div>
            <div className="hero-right">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Image key={i} src={star} alt="star" className="star" />
                ))}
              </div>
              <div className="rating-text">
                <span>3K+ User Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;