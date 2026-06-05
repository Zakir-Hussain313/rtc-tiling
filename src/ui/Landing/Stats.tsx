import FadeIn from '@/Components/FadeIn'
import NumBox from '../../Components/NumBox'
import { getStats } from '../../../lib/getStats'

export default async function Stats() {
    const stats = await getStats()
    return (
        <FadeIn as="div" delay={100}>
            <NumBox stats={stats} />
        </FadeIn>
    )
}