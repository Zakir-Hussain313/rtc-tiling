import Image from "next/image";
import "../../styles/Landing/expertise.css";
import image1 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import image2 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import image3 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import image4 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import image5 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import image6 from '../../assets/images/Airport-crossville-copy.jpg.jpeg';
import Mainbutton from "@/Components/Mainbutton";

export default function Expertise() {
    const services = [
        { label: "Minimalist Interiors", image: image1 },
        { label: "Luxury Design", image: image2 },
        { label: "Industrial Style", image: image3 },
        { label: "Scandinavian Style", image: image4 },
        { label: "Bohemian Vibes", image: image5 },
        { label: "Contemporary Spaces", image: image6 },
    ];

    const items = [...services, ...services, ...services];

    return (
        <main className="expertise-main-section">
            <section className="">
                <section className="title-container">
                    <h1>OUR EXPERTISE</h1>
                    <p>
                        Explore a curated range of interior design styles — from clean
                        minimalism to bold luxury. Find the aesthetic that speaks to you.
                    </p>
                </section>

                <section className="marquee-outer">
                    <div className="marquee-track">
                        {items.map((service, index) => (
                            <div className="service-card" key={index}>
                                <div className=" image-slider-container">
                                    <Image
                                        src={service.image}
                                        alt={service.label}
                                        fill
                                        className="card-image object-cover"
                                        style={{ borderRadius: "30px" }}
                                    />
                                </div>
                                <h3 className="card-label">{service.label}</h3>
                            </div>
                        ))}
                    </div>
                </section>
                <div className="expertise-button-section flex justify-center">
                    <Mainbutton
                        data="All Services"
                        backgroundColor="white"
                        textColor="black"
                        border="2px solid #777"
                        fontSize="clamp(20px, 2.5vw, 25px)"
                        arrowSize="clamp(38px, 4vw, 50px)"
                    />
                </div>
            </section>
        </main>
    );
}