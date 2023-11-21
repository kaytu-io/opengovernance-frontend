import { useParams } from 'react-router-dom'
import {
    Button,
    Card,
    CategoryBar,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import Layout from '../../../../components/Layout'
import { filterAtom, timeAtom } from '../../../../store'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../api/compliance.gen'
import { dateDisplay, dateTimeDisplay } from '../../../../utilities/dateDisplay'
import Header from '../../../../components/Header'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import Breakdown from '../../../../components/Breakdown'
import ListCard from '../../../../components/Cards/ListCard'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    SourceType,
} from '../../../../api/api'
import Spinner from '../../../../components/Spinner'

const generateLineData = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
        | undefined
) => {
    const data = []
    const label = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            label.push(dateDisplay((input[i].timestamp || 0) * 1000))
            data.push((input[i].securityScore || 0).toFixed(2))
        }
    }
    return { data, label }
}

const topList = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const data = []
    if (input) {
        for (let i = 0; i < (input.records?.length || 0); i += 1) {
            data.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records ? input.records[i].Service : '',
                value: input.records ? input.records[i].count : 0,
            })
        }
    }
    return { data, total: input?.totalCount || 0 }
}

const topConnections = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const top: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType[] | SourceType | undefined
            kaytuId: string | undefined
        }[]
        total: number | undefined
    } = { data: [], total: 0 }
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.data.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Connection?.providerConnectionName,
                value: input.records[i].count,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                connector: input.records[i].Connection?.connector,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                kaytuId: input.records[i].Connection?.id,
            })
        }
        top.total = input.totalCount
    }
    return top
}

export default function BenchmarkSummary() {
    const { id, resourceId } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(resourceId && {
            resourceCollection: [resourceId],
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
    }

    const topQuery = {
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

    const { response: benchmarkTrend } =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useComplianceApiV1BenchmarksTrendDetail(String(id), query)
    const {
        response: benchmarkDetail,
        isLoading,
        sendNow: updateDetail,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(id))
    const {
        isLoading: evaluateLoading,
        sendNow: triggerEvaluate,
        isExecuted,
    } = useScheduleApiV1ComplianceTriggerUpdate(String(id), {}, false)
    const { response: connections } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'connectionID',
        5,
        topQuery
    )
    const { response: services } = useComplianceApiV1FindingsTopDetail(
        String(id),
        'service',
        5,
        topQuery
    )

    useEffect(() => {
        if (isExecuted) {
            updateDetail()
        }
    }, [isExecuted])

    const critical = benchmarkDetail?.checks?.criticalCount || 0
    const high = benchmarkDetail?.checks?.highCount || 0
    const medium = benchmarkDetail?.checks?.mediumCount || 0
    const low = benchmarkDetail?.checks?.lowCount || 0
    const passed = benchmarkDetail?.checks?.passedCount || 0
    const unknown = benchmarkDetail?.checks?.unknownCount || 0

    const total = critical + high + medium + low + passed + unknown
    const failed = critical + high + medium + low

    return (
        <Layout currentPage="compliance">
            <Header
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                filter
                datePicker
            />
            {isLoading ? (
                <Spinner className="mb-12" />
            ) : (
                <Flex alignItems="end" className="mb-6">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                    >
                        <Title className="font-semibold mb-1">
                            {benchmarkDetail?.title}
                        </Title>
                        <Text className="w-2/3">
                            {benchmarkDetail?.description}
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="w-fit"
                    >
                        <Button
                            variant="light"
                            icon={ArrowPathRoundedSquareIcon}
                            className="mb-1"
                            onClick={() => triggerEvaluate()}
                            loading={
                                !(
                                    benchmarkDetail?.lastJobStatus ===
                                        'FAILED' ||
                                    benchmarkDetail?.lastJobStatus ===
                                        'SUCCEEDED'
                                )
                            }
                        >
                            {benchmarkDetail?.lastJobStatus === 'FAILED' ||
                            benchmarkDetail?.lastJobStatus === 'SUCCEEDED'
                                ? 'Evaluate now'
                                : 'Evaluating'}
                        </Button>
                        <Text className="whitespace-nowrap">{`Last evaluation: ${dateTimeDisplay(
                            benchmarkDetail?.evaluatedAt
                        )}`}</Text>
                    </Flex>
                </Flex>
            )}
            <Card className="mb-4">
                <Grid numItems={7} className="w-full">
                    <SummaryCard
                        title="Score"
                        metric={`${((passed / total) * 100).toFixed(2)} %`}
                        border={false}
                        loading={isLoading}
                        url="details"
                    />
                    <Col numColSpan={2}>
                        <Flex
                            flexDirection="col"
                            justifyContent="center"
                            className="h-full"
                        >
                            <CategoryBar
                                className={`w-full mb-3 ${
                                    total ? '' : 'hidden'
                                }`}
                                values={[
                                    (critical / total) * 100 || 0,
                                    (high / total) * 100 || 0,
                                    (medium / total) * 100 || 0,
                                    (low / total) * 100 || 0,
                                    (passed / total) * 100 || 0,
                                    critical + high + medium + low + passed > 0
                                        ? (unknown / total) * 100 || 0
                                        : 100,
                                ]}
                                markerValue={
                                    ((critical + high + medium + low) / total) *
                                        100 || 1
                                }
                                showLabels={false}
                                colors={[
                                    'rose',
                                    'orange',
                                    'amber',
                                    'yellow',
                                    'emerald',
                                    'slate',
                                ]}
                            />
                            <Flex className={`${total ? '' : 'hidden'}`}>
                                <Text className="text-xs">{`${failed} of ${total} checks failed`}</Text>
                                {!!(failed / total) && (
                                    <Text className="text-xs font-semibold">{`${Math.round(
                                        (failed / total) * 100
                                    )}% failed`}</Text>
                                )}
                            </Flex>
                        </Flex>
                    </Col>
                    <Col numColSpan={3} />
                    <Flex justifyContent="end">
                        <TabGroup
                            index={selectedIndex}
                            onIndexChange={setSelectedIndex}
                            className="w-fit rounded-lg"
                        >
                            <TabList variant="solid">
                                <Tab value="line">
                                    <LineChartIcon className="h-5" />
                                </Tab>
                                <Tab value="bar">
                                    <BarChartIcon className="h-5" />
                                </Tab>
                            </TabList>
                        </TabGroup>
                    </Flex>
                </Grid>
                <Flex justifyContent="end" className="mt-6 gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-kaytu-950" />
                    <Text>Score</Text>
                </Flex>
                <Chart
                    labels={generateLineData(benchmarkTrend).label}
                    chartData={generateLineData(benchmarkTrend).data}
                    chartType={selectedChart}
                    isPercent
                />
            </Card>
            <Grid numItems={5} className="w-full gap-4">
                <Col numColSpan={2}>
                    <Breakdown
                        title="Severity breakdown"
                        chartData={[
                            { name: 'Critical', value: critical },
                            { name: 'High', value: high },
                            { name: 'Medium', value: medium },
                            { name: 'Low', value: low },
                            { name: 'Passed', value: passed },
                            { name: 'Unknown', value: unknown },
                        ]}
                        loading={isLoading}
                    />
                </Col>
                <Col numColSpanLg={3} className="h-full">
                    <Grid numItems={2} className="w-full h-full gap-4">
                        <ListCard
                            title="Top accounts"
                            loading={isLoading}
                            items={topConnections(connections)}
                            url="details#cloud-accounts"
                            type="account"
                        />
                        <ListCard
                            title="Top resources"
                            loading={isLoading}
                            items={topList(services)}
                            url="details#resources"
                            type="service"
                            isClickable={false}
                        />
                    </Grid>
                </Col>
            </Grid>
        </Layout>
    )
}
