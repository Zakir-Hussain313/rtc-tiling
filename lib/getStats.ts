import Stats from '../models/Stats'
import { connectDB } from './mongodb'
import { unstable_cache } from 'next/cache'

export type StatItem = {
    id: number
    value: number
    symbol: string
    label: string
}

export const getStats = unstable_cache(
    async (): Promise<StatItem[]> => {
        try {
            await connectDB()
            const data = await Stats.findOne().lean() as any
            if (!data?.stats?.length) return []
            return data.stats.map((s: any) => ({
                id: s.id,
                value: Number(s.value),
                symbol: s.suffix,
                label: s.label,
            }))
        } catch (err) {
            console.error('[getStats]', err)
            return []
        }
    },
    ['stats-data'],
    { revalidate: 60, tags: ['stats-data'] }
)