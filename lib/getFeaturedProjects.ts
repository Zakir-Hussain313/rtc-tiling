import { connectDB } from './mongodb'
import Project from 'models/Project'
import { unstable_cache } from 'next/cache'

export type FeaturedProject = {
    _id: string
    title: string
    images: string[]
    slug: string
}

export const getFeaturedProjects = unstable_cache(
    async (): Promise<FeaturedProject[]> => {
        try {
            await connectDB()
            const projects = await Project.find({ featured: true })
                .sort({ order: 1, createdAt: -1 })
                .select('title images slug')
                .lean()
            return projects.map((p: any) => ({
                _id: String(p._id),
                title: p.title,
                images: p.images,
                slug: p.slug,
            }))
        } catch (err) {
            console.error('[getFeaturedProjects] Failed to fetch', err)
            return []
        }
    },
    ['featured-projects'],
    { revalidate: 60, tags: ['projects-data'] }
)