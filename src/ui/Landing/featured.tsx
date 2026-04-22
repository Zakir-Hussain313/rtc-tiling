import "../../styles/Landing/featured.css"
import FeaturedGrid from "@/Components/FeaturedGrid"
import Mainbutton from "@/Components/Mainbutton"

export default function Featured() {
    return (
        <main className="featured-main-section">
            <section className="featured-second-main-section">
                <section className="title-section">
                    <h1>FEATURED</h1>
                    <p>Crafted Surfaces, Captured Moments</p>
                </section>
                <FeaturedGrid />
                <div className="button-section">
                    <Mainbutton
                        data="View Gallery"
                        backgroundColor="white"
                        textColor="black"
                        border="2px solid #777"
                        fontSize="clamp(20px, 2.5vw, 25px)"
                        arrowSize="clamp(38px, 4vw, 50px)"
                    />
                </div>
            </section>
        </main>
    )
}