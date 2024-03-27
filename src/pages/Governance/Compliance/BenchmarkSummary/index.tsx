import { useParams } from 'react-router-dom'
import { Card, Flex, Grid, Text, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingEventsCountList,
} from '../../../../api/compliance.gen'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import Spinner from '../../../../components/Spinner'
import Controls from '../../Controls'
import Settings from './Settings'
import TopHeader from '../../../../components/Layout/Header'
import {
    defaultTime,
    useFilterState,
    useUrlDateRangeState,
} from '../../../../utilities/urlstate'
import BenchmarkChart from '../../../../components/Benchmark/Chart'
import { toErrorMessage } from '../../../../types/apierror'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import Evaluate from './Evaluate'

export default function BenchmarkSummary() {
    const { ws } = useParams()
    const { value: activeTimeRange } = useUrlDateRangeState(
        defaultTime(ws || '')
    )
    const { benchmarkId } = useParams()
    const { value: selectedConnections } = useFilterState()
    const [assignments, setAssignments] = useState(0)
    const [recall, setRecall] = useState(false)

    const topQuery = {
        ...(benchmarkId && { benchmarkId: [benchmarkId] }),
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
    }

    const {
        response: benchmarkDetail,
        isLoading,
        sendNow: updateDetail,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId))
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const { sendNowWithParams: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(
            {
                benchmark_id: [],
                connection_id: [],
            },
            {},
            false
        )

    const {
        response: benchmarkKPIStart,
        isLoading: benchmarkKPIStartLoading,
        sendNow: benchmarkKPIStartSend,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
        ...topQuery,
        timeAt: activeTimeRange.start.unix(),
    })
    const {
        response: benchmarkKPIEnd,
        isLoading: benchmarkKPIEndLoading,
        sendNow: benchmarkKPIEndSend,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
        ...topQuery,
        timeAt: activeTimeRange.end.unix(),
    })

    const hideKPIs =
        (benchmarkKPIEnd?.conformanceStatusSummary?.failed || 0) +
            (benchmarkKPIEnd?.conformanceStatusSummary?.passed || 0) +
            (benchmarkKPIStart?.conformanceStatusSummary?.failed || 0) +
            (benchmarkKPIStart?.conformanceStatusSummary?.passed || 0) ===
        0
    const {
        response: events,
        isLoading: eventsLoading,
        sendNow: eventsSend,
    } = useComplianceApiV1FindingEventsCountList({
        benchmarkID: benchmarkId ? [benchmarkId] : undefined,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    })

    const {
        response: trend,
        isLoading: trendLoading,
        error: trendError,
        sendNow: sendTrend,
    } = useComplianceApiV1BenchmarksTrendDetail(String(benchmarkId), {
        ...topQuery,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    })

    useEffect(() => {
        if (isExecuted || recall) {
            updateDetail()
        }
    }, [isExecuted, recall])

    return (
        <>
            <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                filter
                datePicker
            />
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex alignItems="start" className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-3/4"
                        >
                            <Title className="font-semibold">
                                {benchmarkDetail?.title}
                            </Title>
                            <div className="group w-full relative flex justify-start">
                                <Text className="test-start truncate">
                                    {benchmarkDetail?.description}
                                </Text>
                                <Card className="absolute w-full z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </Card>
                            </div>
                        </Flex>
                        <Flex className="w-fit gap-4">
                            <Settings
                                id={benchmarkDetail?.id}
                                response={(e) => setAssignments(e)}
                                autoAssign={benchmarkDetail?.autoAssign}
                                isAutoResponse={(x) => setRecall(true)}
                            />
                            <Evaluate
                                id={benchmarkDetail?.id}
                                benchmarkDetail={benchmarkDetail}
                                assignmentsCount={assignments}
                                onEvaluate={(c) => {
                                    setSelectedAccounts(() => c)
                                    triggerEvaluate(
                                        {
                                            benchmark_id: [benchmarkId || ''],
                                            connection_id: c,
                                        },
                                        {}
                                    )
                                }}
                            />
                        </Flex>
                    </Flex>

                    {hideKPIs ? (
                        ''
                    ) : (
                        <Grid numItems={4} className="w-full gap-4 mb-4">
                            <SummaryCard
                                title="Issues"
                                metric={
                                    benchmarkKPIEnd?.conformanceStatusSummary
                                        ?.failed
                                }
                                metricPrev={
                                    benchmarkKPIStart?.conformanceStatusSummary
                                        ?.failed
                                }
                                loading={
                                    benchmarkKPIEndLoading ||
                                    benchmarkKPIStartLoading
                                }
                            />

                            <SummaryCard
                                title="Passed"
                                metric={
                                    benchmarkKPIEnd?.conformanceStatusSummary
                                        ?.passed
                                }
                                metricPrev={
                                    benchmarkKPIStart?.conformanceStatusSummary
                                        ?.passed
                                }
                                loading={
                                    benchmarkKPIEndLoading ||
                                    benchmarkKPIStartLoading
                                }
                            />

                            <SummaryCard
                                title="Accounts"
                                metric={
                                    benchmarkKPIEnd?.connectionsStatus?.total
                                }
                                metricPrev={
                                    benchmarkKPIStart?.connectionsStatus?.total
                                }
                                loading={
                                    benchmarkKPIEndLoading ||
                                    benchmarkKPIStartLoading
                                }
                            />

                            <SummaryCard
                                title="Events"
                                metric={events?.count}
                                loading={eventsLoading}
                            />
                        </Grid>
                    )}
                    {trend === null ? (
                        ''
                    ) : (
                        <BenchmarkChart
                            title="Security Score"
                            isLoading={trendLoading}
                            trend={trend}
                            error={toErrorMessage(trendError)}
                            onRefresh={() => sendTrend()}
                        />
                    )}

                    <Controls
                        id={String(benchmarkId)}
                        assignments={trend === null ? 0 : 1}
                    />
                </>
            )}
        </>
    )
}
