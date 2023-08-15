import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    BadgeDelta,
    Callout,
    Card,
    Flex,
    List,
    ListItem,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup } from '../../../api/api'

interface IInsightGroupCard {
    metric: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup
}

const calculatePercent = (
    inputData: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup
) => {
    if (
        Number(inputData.oldTotalResultValue) &&
        Number(inputData.totalResultValue)
    ) {
        return (
            (((inputData.totalResultValue || 0) -
                (inputData.oldTotalResultValue || 0)) /
                (inputData.oldTotalResultValue || 0)) *
                100 || 0
        )
    }
    return 0
}

const generateBadge = (
    met: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup
) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Callout
                title="Time period is not covered by insight"
                color="rose"
                icon={ExclamationCircleIcon}
                className="w-full border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Callout
                title="End value is not available"
                color="rose"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Callout
                title={`Data is availabe after ${dayjs(
                    met.firstOldResultDate
                ).format('MMM DD, YYYY')}`}
                color="rose"
                icon={ExclamationCircleIcon}
                className="border-0 text-xs leading-5 truncate max-w-full"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={
                calculatePercent(met) > 0
                    ? 'moderateIncrease'
                    : 'moderateDecrease'
            }
            className={`opacity-${
                calculatePercent(met) !== 0 ? 1 : 0
            } cursor-pointer my-2`}
        >
            {`${
                calculatePercent(met) > 0
                    ? Math.ceil(calculatePercent(met))
                    : -1 * Math.floor(calculatePercent(met))
            }%`}
        </BadgeDelta>
    )
}

export default function InsightGroupCard({ metric }: IInsightGroupCard) {
    const navigate = useNavigate()
    const navigateToAssetsInsightsDetails = (id: number | undefined) => {
        navigate(`${id}`)
    }

    return (
        <Card key={metric.id}>
            <Title className="font-semibold mb-2 w-full truncate">
                {metric?.shortTitle}
            </Title>
            <Flex flexDirection="row" className="mb-2">
                <Flex flexDirection="row" alignItems="end" className="w-fit">
                    {!!metric?.totalResultValue && (
                        <Title className="font-semibold mr-1">
                            {numericDisplay(metric?.totalResultValue || 0)}
                        </Title>
                    )}
                    {!!metric?.oldTotalResultValue && (
                        <Subtitle className="text-sm mb-0.5">
                            {`from ${numericDisplay(
                                metric?.oldTotalResultValue || 0
                            )}`}
                        </Subtitle>
                    )}
                </Flex>
                {generateBadge(metric)}
            </Flex>
            <Subtitle className="line-clamp-2 h-14 text-gray-600 text-base">
                {metric?.description}
            </Subtitle>
            <Flex className="mt-2 mb-3">
                <Text className="font-semibold">Insight</Text>
                <Text className="font-semibold">Total</Text>
            </Flex>
            <List className="w-full">
                {metric.insights
                    ?.filter((insight, i: number) => i < 2)
                    .map((insight) => (
                        <ListItem
                            onClick={() =>
                                (insight?.totalResultValue ||
                                    insight?.oldTotalResultValue) &&
                                navigateToAssetsInsightsDetails(insight.id)
                            }
                            className={`${
                                insight?.totalResultValue ||
                                insight?.oldTotalResultValue
                                    ? 'cursor-pointer'
                                    : 'bg-slate-50'
                            }`}
                        >
                            <Subtitle className="truncate text-base w-3/4 text-gray-600">
                                {insight.shortTitle}
                            </Subtitle>
                            <Subtitle
                                className={`font-semibold ${
                                    (insight?.totalResultValue || 0) -
                                        (insight?.oldTotalResultValue || 0) >
                                    0
                                        ? 'text-green-600'
                                        : 'text-rose-600'
                                }`}
                            >
                                {numericDisplay(insight.totalResultValue) ||
                                    'N/A'}
                            </Subtitle>
                        </ListItem>
                    ))}
            </List>
            <Accordion className="w-full border-0 rounded-none">
                <AccordionBody className="p-0 w-full">
                    <List>
                        {metric.insights
                            ?.filter((insight, i: number) => i > 1)
                            .map((insight, i: number) => (
                                <ListItem
                                    onClick={() =>
                                        (insight?.totalResultValue ||
                                            insight?.oldTotalResultValue) &&
                                        navigateToAssetsInsightsDetails(
                                            insight.id
                                        )
                                    }
                                    className={`${
                                        insight?.totalResultValue ||
                                        insight?.oldTotalResultValue
                                            ? 'cursor-pointer'
                                            : 'bg-slate-50'
                                    } ${i === 0 && 'border-t border-gray-200'}`}
                                >
                                    <Text className="truncate text-base w-3/4 text-gray-600">
                                        {insight.shortTitle}
                                    </Text>
                                    <Text
                                        className={`font-semibold ${
                                            (insight?.totalResultValue || 0) -
                                                (insight?.oldTotalResultValue ||
                                                    0) >
                                            0
                                                ? 'text-green-600'
                                                : 'text-rose-600'
                                        }`}
                                    >
                                        {numericDisplay(
                                            insight.totalResultValue
                                        ) || 'N/A'}
                                    </Text>
                                </ListItem>
                            ))}
                    </List>
                </AccordionBody>
                <AccordionHeader
                    color="blue"
                    className={`p-0 w-full pr-0.5 ${
                        (metric.insights?.length || 0) > 2
                            ? 'opacity-100'
                            : 'opacity-0 cursor-default'
                    }`}
                >
                    <Flex justifyContent="end">
                        <Text color="blue" className="-mr-2">
                            see more
                        </Text>
                    </Flex>
                </AccordionHeader>
            </Accordion>
        </Card>
    )
}
