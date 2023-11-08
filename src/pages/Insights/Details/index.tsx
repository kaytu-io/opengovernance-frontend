import { useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { filterAtom, timeAtom } from '../../../store'
import InsightDetail from './InsightDetail'
import KeyInsightDetail from './KeyInsightDetail'
import Layout from '../../../components/Layout'

export default function InsightDetails() {
    const { id, ws } = useParams()
    const isKeyInsight = id?.includes('key_insight_')

    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    return (
        <Layout currentPage="insights">
            {isKeyInsight ? (
                <KeyInsightDetail
                    id={id?.replace('key_insight_', '')}
                    activeTimeRange={activeTimeRange}
                    selectedConnections={selectedConnections}
                />
            ) : (
                <InsightDetail
                    id={id}
                    ws={ws}
                    activeTimeRange={activeTimeRange}
                    selectedConnections={selectedConnections}
                />
            )}
        </Layout>
    )
}
