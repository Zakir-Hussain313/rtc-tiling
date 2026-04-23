import Image from 'next/image'
import '../../styles/Services/ServicesListing.css'
import arrow from "../../assets/icons/Arrow.svg"
import fallbackImage from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Link from 'next/link'
import { connectDB } from 'lib/mongodb'
import Service from 'models/Service'
import FadeIn from '@/Components/FadeIn'

type ServiceDoc = {
    _id: string
    title: string
    description: string
    image: string
    slug: string
}

async function getServices(): Promise<ServiceDoc[]> {
    try {
        await connectDB()
        const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean()
        return services as unknown as ServiceDoc[]
    } catch (err) {
        console.error('[ServicesListing] Failed to fetch services', err)
        return []
    }
}

export default async function ServicesListing() {
    const services = await getServices()

    return (
        <main>
            <section className="ServicesListing-main-section">
                {services.map((service, index) => (
                    <FadeIn as="div" key={service._id} delay={index * 100}>
                        <Link href={service.slug} className='services-div'>
                            <div className="services-image">
                                <Image
                                    src={service.image || fallbackImage}
                                    alt={service.title}
                                    fill
                                    className='img rounded-[40px] object-cover'
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                            </div>
                            <h1>{service.title}</h1>
                            <p className='services-description'>{service.description}</p>
                            <div className='services-arrow'>
                                <Image src={arrow} alt='arrow' width={27} height={27} />
                            </div>
                        </Link>
                        <hr />
                    </FadeIn>
                ))}

                {services.length === 0 && (
                    <p style={{ padding: '2rem', opacity: 0.5 }}>No services available yet.</p>
                )}
            </section>
        </main>
    )
}