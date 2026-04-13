import ServicesPageIntro from "./PageIntro";
import '../../styles/Services/Services.css'
import ServicesListing from "./ServicesListing";
import ServicesCTA from "./ServicesCTA";

export default function Services(){
    return(
        <main className="services-main-section">
            <ServicesPageIntro />
            <ServicesListing />
            <ServicesCTA />
        </main>
    )
}