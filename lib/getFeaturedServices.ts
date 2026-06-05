import { unstable_cache } from 'next/cache';
import { connectDB } from './mongodb';
import Service from '../models/Service';

export const getFeaturedServices = unstable_cache(
    async () => {
        try {
            await connectDB();
            const services = await Service.find({}, { title: 1, images: 1, slug: 1 })
                .limit(6)
                .lean();
            return services.map((s: any) => ({
                _id: String(s._id),
                title: s.title,
                images: s.images ?? [],
                slug: s.slug.startsWith('/services/')
                    ? s.slug.replace('/services/', '')
                    : s.slug,
            }));
        } catch {
            return [];
        }
    },
    ['featured-services'],
    { revalidate: 60, tags: ['services-data'] }
);