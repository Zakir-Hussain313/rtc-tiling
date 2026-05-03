
import Image from 'next/image'
import '../styles/WhyChooseUs.css'
import FadeIn from './FadeIn'
import image1 from '../assets/images/Sydney region icon.png'
import image2 from '../assets/images/Supply and install icon.png'
import image3 from '../assets/images/warranty icon.png'
import image4 from '../assets/images/work on job icon.png'
import image5 from '../assets/images/best price icon.png'

const chooseItems = [
    {
        image: image1,
        title: 'Sydney Region',
        description: 'We service All the sydney region'
    },
    {
        image: image2,
        title: 'Supply & Install',
        description: 'We supply and install Tiles / Waterproofing / Silicone'
    },
    {
        image: image3,
        title: 'Warranty',
        description: 'We provide 10 years worksmanship warranty'
    },
    {
        image: image4,
        title: 'Work on any job',
        description: 'We work on small, as well as large jobs'
    },
    {
        image: image5,
        title: 'Best price',
        description: 'Best price guarenteed'
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