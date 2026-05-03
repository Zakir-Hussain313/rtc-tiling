
import '../../styles/WhyChooseUs.css'
import { SiMaterialformkdocs } from "react-icons/si";
import { GiStoneCrafting } from "react-icons/gi";
import { SlCalender } from "react-icons/sl";
import { IoCallSharp } from "react-icons/io5";

export default function WhyChooseUs(){
    return(
        <main className='choose-main-section'>
            <section className='choose-heading'>
                <h1>Why Choose Us</h1>
            </section>
            <section className='choose-body'>
                <div className='choose-body-children'>
                    <SiMaterialformkdocs size={100} color='#555'/>
                    <h2>Quality Materials</h2>
                </div>
                <div className='choose-body-children'>
                    <GiStoneCrafting size={100} color='#555'/>
                    <h2>Skilled Craftsmenship</h2>
                </div>
                <div className='choose-body-children'>
                    <SlCalender size={100} color='#555'/>
                    <h2>On-Time Delivery</h2>
                </div>
                <div className='choose-body-children'>
                    <IoCallSharp size={100} color='#555'/>
                    <h2>Free Consultation</h2>
                </div>
            </section>
        </main>
    )
}