import Image from 'next/image'
import { notFound } from 'next/navigation'
import { connectDB } from 'lib/mongodb'
import Project from 'models/Project'
import fallbackImage from '../../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'

type ProjectDetail = {
    _id: string
    title: string
    day: string
    month: string
    year: string
    image: string
    slug: string
    description?: string
}

type Props = {
    params: Promise<{ slug: string }>
}

async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
    try {
        await connectDB()
        const project = await Project.findOne({ slug }).lean()
        return project as unknown as ProjectDetail | null
    } catch (err) {
        console.error('[ProjectDetail] Failed to fetch project', err)
        return null
    }
}

export async function generateStaticParams() {
    try {
        await connectDB()
        const projects = await Project.find({}, { slug: 1 }).lean()
        return projects.map((p: any) => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)
    if (!project) return {}

    return {
        title: project.title,
        description: project.description || `Details about ${project.title}`,
        openGraph: {
            title: project.title,
            description: project.description || `Details about ${project.title}`,
            images: project.image ? [{ url: project.image }] : [],
        },
    }
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) notFound()

    return (
        <main>
            <section className="project-detail-section">
                <div className="project-detail-image">
                    <Image
                        src={project.image || fallbackImage}
                        alt={project.title}
                        fill
                        className="object-cover rounded-[40px]"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        priority
                    />
                </div>

                <div className="project-detail-content">
                    <h1>{project.title}</h1>
                    <p className="project-date">
                        {project.day} / {project.month} / {project.year}
                    </p>
                    {project.description && (
                        <p className="project-description">{project.description}</p>
                    )}
                </div>
            </section>
        </main>
    )
}