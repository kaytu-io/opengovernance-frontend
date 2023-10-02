import { Card, Text, Title } from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { getConnectorIcon } from '../ConnectorCard'
import ChangeDelta from '../../ChangeDelta'

interface IInsightsCard {
    metric: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
}

const generateBadge = (
    met: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full mb-1"
            >
                (Time period is not covered by insight)
            </Text>
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full"
            >
                (End value is not available)
            </Text>
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Text
                color="orange"
                className="w-full border-0 text-xs truncate max-w-full"
            >
                {`(Data is available after ${dateDisplay(
                    met.firstOldResultDate
                )})`}
            </Text>
        )
    }
    return (
        <ChangeDelta
            deltaType={badgeTypeByDelta(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
            change={percentageByChange(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
        />
    )
}

export default function InsightCard({ metric }: IInsightsCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }
    return (
        <Card
            key={metric.id}
            className={`${
                metric?.totalResultValue || metric?.oldTotalResultValue
                    ? 'cursor-pointer'
                    : ''
            } h-full`}
            onClick={() =>
                (metric?.totalResultValue || metric?.oldTotalResultValue) &&
                navigateToAssetsInsightsDetails(metric.id)
            }
        >
            {getConnectorIcon(metric?.connector)}
            <Title className="font-semibold mt-2 mb-3 truncate max-w-full">
                {metric?.shortTitle}
            </Title>
            {generateBadge(metric)}
        </Card>
    )
}
