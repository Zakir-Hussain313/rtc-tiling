
import Image from 'next/image'
import '../styles/WhyChooseUs.css'
import FadeIn from './FadeIn'
import image1 from '../assets/images/NSW-wide.png'
import image2 from '../assets/images/Supply and install icon.png'
import image3 from '../assets/images/warranty icon.png'
import image4 from '../assets/images/all-project-sizes.png'
import image5 from '../assets/images/Competitve-Pricing.png'
import image6 from '../assets/images/Licensed-and-Insured.png'
import image7 from '../assets/images/Residential,commercial-and-industrial.png'

const chooseItems = [
    {
        image: image1,
        title: 'NSW WIDE SERVICE',
        description: 'Servicing Residential, Commercial & Industrial Projects Across NSW'
    },
    {
        image: image2,
        title: 'Complete Supply & Install',
        description: 'We Provide End-to-End Solutions For All Your Building & Renovation Needs'
    },
    {
        image: image3,
        title: 'CERTIFIED WARRANTY',
        description: ' We Issue Workmanship Certificates With Warranty Coverage Up To 10 Years'
    },
    {
        image: image4,
        title: 'ALL PROJECT SIZES',
        description: 'From Minor Repairs To Large-Scale Residential, Commercial & Industrial Projects'
    },
    {
        image: image5,
        title: 'COMPETITIVE PRICING',
        description: 'Premium Workmanship At Fair & Transparent Rates'
    },
    {
        image: image6,
        title: 'LICENSED & INSURED',
        description: 'Fully Licensed And Insured'
    },
    {
        image: image7,
        title: 'RESIDENTIAL COMMERCIAL INDUSTRIAL',
        description: 'Specialised Solutions Across Every Sector'
    },
]

export default function WhyChooseUs() {
    return (
        <main className='choose-main-section'>
            <FadeIn className='choose-heading' delay={150}>
                <h1>Why Choose Us</h1>
            </FadeIn>
            <FadeIn className='choose-body' delay={150}>
                {chooseItems.map((item, index) => (
                    <div className='choose-item' key={index}>
                        <div className='item-image'>
                            <Image
                                src={item.image}
                                alt=''
                                fill
                                className='object-cover img'
                            />
                        </div>
                        <h1 className='item-h1'>{item.title}</h1>
                        <p className='item-description'>{item.description}</p>
                    </div>
                ))}
            </FadeIn>
        </main>
    )
}