
import Image from 'next/image'
import '../../styles/Projects/ProjectsListing.css'
import arrow from "../../assets/icons/Arrow.svg";
import image1 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image2 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image3 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image4 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image5 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Link from 'next/link';

const projects = [
    { image: image1, title: 'POOL TILED', day: '04', month: '03', year: '2025' },
    { image: image2, title: 'KITCHEN DONE', day: '04', month: '03', year: '2025' },
    { image: image3, title: 'SKIRTING FINISHED', day: '04', month: '03', year: '2025' },
    { image: image4, title: 'FLOORING AT AIRPORT', day: '04', month: '03', year: '2025' },
    { image: image5, title: 'PROJECT AT WESTPOINT', day: '04', month: '03', year: '2025' },
]

export default function ProjectsListing() {
    return (
        <main>
            <section className="projectsListing-main-section">
                {projects.map((project, index) => (
                    <div key={index}>
                        <Link href={''} className='projects-div'>
                            <div className="project-image">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className='img rounded-[40px] object-cover'
                                />
                            </div>
                            <h1>{project.title}</h1>
                        <p className='project-date'>{project.day} / {project.month} / {project.year}</p>
                        <div className='project-arrow'>
                            <Image
                                src={arrow}
                                alt='arrow'
                                width={27}
                                height={27}
                                className=''
                            />
                        </div>
                    </Link>
                    <hr />
                    </div>
                ))}
            </section>
        </main>
    )
}