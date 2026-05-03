import Image from 'next/image'
import '../../styles/Projects/ProjectsListing.css'
import arrow from "../../assets/icons/Arrow.svg"
import fallbackImage from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Link from 'next/link'
import { connectDB } from 'lib/mongodb'
import Project from 'models/Project'
import FadeIn from '@/Components/FadeIn'
import { unstable_noStore as noStore } from 'next/cache';
import { optimizeCloudinaryUrl } from 'lib/cloudinary'

type ProjectDoc = {
    _id: string
    title: string
    date: string
    images: string[]
    slug: string
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function getTitleSize(title: string): string {
    const longestWord = Math.max(...title.split(' ').map(w => w.length));
    if (longestWord > 14) return '28px';
    if (longestWord > 11) return '34px';
    return '40px';
}

async function getProjects(): Promise<ProjectDoc[]> {
    noStore();
    try {
        await connectDB()
        const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean()
        return projects as unknown as ProjectDoc[]
    } catch (err) {
        console.error('[ProjectsListing] Failed to fetch projects', err)
        return []
    }
}

export default async function ProjectsListing() {
    const projects = await getProjects()
    return (
        <section className='projectsListing-main-main-section'>
            <section className="projectsListing-main-section">
                {projects.map((project, index) => (
                    <FadeIn as={'div'} delay={index * 100} key={project._id}>
                        <Link href={`/projects/${project.slug}`} className='projects-div'>
                            <div className="project-image">
                                <Image
                                    src={project.images?.[0] ? optimizeCloudinaryUrl(project.images[0], 800) : fallbackImage}
                                    alt={project.title}
                                    fill
                                    className='img rounded-[40px] object-cover'
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                            </div>
                            <h1 style={{ '--title-size': getTitleSize(project.title) } as React.CSSProperties}>
                                {project.title}
                            </h1>
                            <p className='project-date'>
                                {formatDate(project.date)}
                            </p>
                            <div className='project-arrow'>
                                <Image
                                    src={arrow}
                                    alt='arrow'
                                    width={27}
                                    height={27}
                                />
                            </div>
                        </Link>
                        <hr />
                    </FadeIn>
                ))}

                {projects.length === 0 && (
                    <p style={{ padding: '2rem', opacity: 0.5 }}>
                        No projects available yet.
                    </p>
                )}
            </section>
        </section>
    )
}