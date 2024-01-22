import { Col, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ListCard from '../../../components/Cards/ListCard'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTableList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../api/integration.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { topAccounts, topCategories, topServices } from '..'
import { SpendChart } from '../../../components/Spend/Chart'
import { getErrorMessage, toErrorMessage } from '../../../types/apierror'
import {
    ChartLayout,
    Granularity,
} from '../../../components/Spend/Chart/Selectors'
import TopHeader from '../../../components/Layout/Header'
import { accountTrend } from '../Account'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
} from '../../../api/api'

const categoryTrend = (
    responseChart: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
) => {
    return responseChart?.map((item) => {
        return {
            ...item,
            costStacked: item.costStacked
                ?.flatMap((st) =>
                    st.category?.map((cat) => {
                        const v: GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem =
                            {
                                metricID: cat,
                                metricName: cat,
                                category: [cat],
                                cost: st.cost,
                            }
                        return v
                    })
                )
                .reduce<
                    GithubComKaytuIoKaytuEnginePkgInventoryApiCostStackedItem[]
                >((prev, curr) => {
                    if (curr === undefined) {
                        return prev
                    }
                    if (
                        prev.filter((i) => i.metricID === curr?.metricID)
                            .length > 0
                    ) {
                        return prev.map((i) => {
                            if (i.metricID === curr.metricID) {
                                return {
                                    ...i,
                                    cost: (i.cost || 0) + (curr.cost || 0),
                                }
                            }
                            return i
                        })
                    }
                    return [...prev, curr]
                }, []),
        }
    })
}

export function SpendOverview() {
    const workspace = useParams<{ ws: string }>().ws
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [granularity, setGranularity] = useState<Granularity>('daily')

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'cost' | undefined
        endTime: number
        startTime: number
        connectionId: string[]
        connector?: ('AWS' | 'Azure')[] | undefined
    } = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost',
    }

    const duration =
        activeTimeRange.end.diff(activeTimeRange.start, 'second') + 1
    const prevTimeRange = {
        start: activeTimeRange.start.add(-duration, 'second'),
        end: activeTimeRange.end.add(-duration, 'second'),
    }
    const prevQuery = {
        ...query,
        ...(activeTimeRange.start && {
            startTime: prevTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: prevTimeRange.end.unix(),
        }),
    }

    const {
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: costTrendRefresh,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity,
    })

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)

    const {
        response: accountCostResponse,
        isLoading: accountCostLoading,
        error: accountCostError,
        sendNow: refreshAccountCost,
    } = useIntegrationApiV1ConnectionsSummariesList(query)

    const {
        response: composition,
        isLoading: compositionLoading,
        error: compositionError,
        sendNow: refreshComposition,
    } = useInventoryApiV2AnalyticsSpendCompositionList({
        top: 5,
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            endTime: activeTimeRange.end.unix(),
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
    })

    const { response: responseChart, isLoading: isLoadingChart } =
        useInventoryApiV2AnalyticsSpendTableList({
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: 'connection',
            granularity,
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            connectionGroup: selectedConnections.connectionGroup,
        })

    const [chartLayout, setChartLayout] = useState<ChartLayout>('categories')
    const trend = () => {
        if (chartLayout === 'total' || chartLayout === 'metrics') {
            return costTrend || []
        }
        if (chartLayout === 'accounts' || chartLayout === 'provider') {
            return accountTrend(responseChart || [], chartLayout) || []
        }
        if (chartLayout === 'categories') {
            return categoryTrend(costTrend || [])
        }
        return []
    }
    return (
        <>
            <TopHeader datePicker filter />
            <Grid numItems={3} className="w-full gap-4">
                <Col numColSpan={3}>
                    <SpendChart
                        costTrend={trend()}
                        title="Total spend"
                        timeRange={activeTimeRange}
                        timeRangePrev={prevTimeRange}
                        total={serviceCostResponse?.total_cost || 0}
                        totalPrev={servicePrevCostResponse?.total_cost || 0}
                        chartLayout={chartLayout}
                        setChartLayout={setChartLayout}
                        validChartLayouts={[
                            'total',
                            'categories',
                            'provider',
                            'metrics',
                            'accounts',
                        ]}
                        isLoading={
                            costTrendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            costTrendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                        onRefresh={() => {
                            costTrendRefresh()
                            serviceCostPrevRefresh()
                            serviceCostRefresh()
                        }}
                        onGranularityChanged={setGranularity}
                    />
                </Col>
                <Col numColSpan={1}>
                    <ListCard
                        title="Top Spend Categories"
                        keyColumnTitle="Category"
                        valueColumnTitle="Spend"
                        loading={compositionLoading}
                        items={topCategories(composition)}
                        url={`/${workspace}/spend-metrics?groupby=category`}
                        type="service"
                        isPrice
                        error={getErrorMessage(compositionError)}
                        onRefresh={refreshComposition}
                        isClickable={false}
                    />
                </Col>
                <Col numColSpan={1} className="h-full">
                    <ListCard
                        title="Top Cloud Accounts"
                        keyColumnTitle="Account Names"
                        valueColumnTitle="Spend"
                        loading={accountCostLoading}
                        items={topAccounts(accountCostResponse)}
                        url={`/${workspace}/spend-cloud-accounts`}
                        type="account"
                        isPrice
                        // linkPrefix="accounts/"
                        error={getErrorMessage(accountCostError)}
                        onRefresh={refreshAccountCost}
                        // isClickable={false}
                    />
                </Col>
                <Col numColSpan={1} className="h-full">
                    <ListCard
                        title="Top Metrics"
                        keyColumnTitle="Metric Name"
                        valueColumnTitle="Spend"
                        loading={serviceCostLoading}
                        items={topServices(serviceCostResponse)}
                        url={`/${workspace}/spend-metrics`}
                        type="service"
                        // linkPrefix="metrics/"
                        isPrice
                        error={getErrorMessage(serviceCostErr)}
                        onRefresh={serviceCostRefresh}
                        // isClickable={false}
                    />
                </Col>
            </Grid>
        </>
    )
}
