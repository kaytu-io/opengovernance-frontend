import { Col, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import ListCard from '../../../components/Cards/ListCard'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTableList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../api/inventory.gen'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../api/integration.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { getErrorMessage, toErrorMessage } from '../../../types/apierror'
import {
    ChartLayout,
    Granularity,
} from '../../../components/Spend/Chart/Selectors'
import TopHeader from '../../../components/Layout/Header'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceCountStackedItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    SourceType,
} from '../../../api/api'
import { topAccounts, topServices } from '..'
import { AssetChart } from '../../../components/Asset/Chart'

export const topCategories = (
    input:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse
        | undefined
) => {
    const top: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType | undefined
            id: string | undefined
            kaytuId: string | undefined
        }[]
        total: number | undefined
    } = { data: [], total: 0 }
    if (input && input.top_values) {
        const arr = Object.entries(input.top_values)
        for (let i = 0; i < arr.length; i += 1) {
            const item = arr[i]
            top.data.push({
                kaytuId: item[0],
                name: item[0],
                value: item[1].count,
                connector: SourceType.Nil,
                id: item[0],
            })
        }
        top.total = input.total_value_count
    }
    top.data = top.data.sort((a, b) => {
        if (a.value === b.value) {
            return 0
        }
        return (a.value || 0) < (b.value || 0) ? 1 : -1
    })
    return top
}

const categoryTrend = (
    responseChart: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[]
) => {
    return responseChart?.map((item) => {
        return {
            ...item,
            countStacked: item.countStacked
                ?.flatMap((st) =>
                    st.category?.map((cat) => {
                        const v: GithubComKaytuIoKaytuEnginePkgInventoryApiResourceCountStackedItem =
                            {
                                metricID: cat,
                                metricName: cat,
                                category: [cat],
                                count: st.count,
                            }
                        return v
                    })
                )
                .reduce<
                    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceCountStackedItem[]
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
                                    count: (i.count || 0) + (curr.count || 0),
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

export function AssetOverview() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [granularity, setGranularity] = useState<Granularity>('daily')

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'count' | undefined
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
        sortBy: 'count',
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
        response: trendResponse,
        isLoading: trendLoading,
        error: trendError,
        sendNow: trendRefresh,
    } = useInventoryApiV2AnalyticsTrendList({
        ...query,
        granularity,
    })

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsMetricList(query)

    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsMetricList(prevQuery)

    const {
        response: accountsResponse,
        isLoading: accountsLoading,
        error: accountsError,
        sendNow: accountsRefresh,
    } = useIntegrationApiV1ConnectionsSummariesList({
        ...query,
        pageSize: 5,
        pageNumber: 1,
        needCost: false,
        sortBy: 'resource_count',
    })

    const {
        response: composition,
        isLoading: compositionLoading,
        error: compositionError,
        sendNow: compositionRefresh,
    } = useInventoryApiV2AnalyticsCompositionDetail('category', {
        metricType: 'assets',
        top: 5,
        connector: query.connector,
        connectionId: query.connectionId,
        startTime: query.startTime,
        endTime: query.endTime,
    })

    const { response: responseChart, isLoading: isLoadingChart } =
        useInventoryApiV2AnalyticsTableList({
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: 'connection',
            granularity,
        })

    const [chartLayout, setChartLayout] = useState<ChartLayout>('categories')
    const trend = () => {
        if (chartLayout === 'total' || chartLayout === 'metrics') {
            return trendResponse || []
        }
        if (chartLayout === 'accounts' || chartLayout === 'provider') {
            // return accountTrend(responseChart || [], chartLayout) || []
        }
        if (chartLayout === 'categories') {
            return categoryTrend(trendResponse || [])
        }
        return []
    }
    return (
        <>
            <TopHeader datePicker filter />
            <Grid numItems={3} className="w-full gap-4">
                <Col numColSpan={3}>
                    <AssetChart
                        trend={trend()}
                        title="Total resources"
                        timeRange={activeTimeRange}
                        timeRangePrev={prevTimeRange}
                        total={serviceCostResponse?.total_count || 0}
                        totalPrev={servicePrevCostResponse?.total_count || 0}
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
                            trendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            trendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                        onRefresh={() => {
                            trendRefresh()
                            serviceCostPrevRefresh()
                            serviceCostRefresh()
                        }}
                        onGranularityChanged={setGranularity}
                    />
                </Col>
                <Col numColSpan={1}>
                    <ListCard
                        title="Top Categories"
                        keyColumnTitle="Category"
                        valueColumnTitle="Count"
                        loading={compositionLoading}
                        items={topCategories(composition)}
                        url="metrics?groupby=category"
                        type="service"
                        error={getErrorMessage(compositionError)}
                        onRefresh={compositionRefresh}
                        isClickable={false}
                    />
                </Col>
                <Col numColSpan={1} className="h-full">
                    <ListCard
                        title="Top Cloud Accounts"
                        keyColumnTitle="Account Names"
                        valueColumnTitle="Count"
                        loading={accountsLoading}
                        items={topAccounts(accountsResponse)}
                        url="accounts"
                        type="account"
                        linkPrefix="accounts/"
                        error={getErrorMessage(accountsError)}
                        onRefresh={accountsRefresh}
                        // isClickable={false}
                    />
                </Col>
                <Col numColSpan={1} className="h-full">
                    <ListCard
                        title="Top Metrics"
                        keyColumnTitle="Mertic Names"
                        valueColumnTitle="Count"
                        loading={serviceCostLoading}
                        items={topServices(serviceCostResponse)}
                        url="metrics"
                        type="service"
                        linkPrefix="metrics/"
                        error={getErrorMessage(serviceCostErr)}
                        onRefresh={serviceCostRefresh}
                        // isClickable={false}
                    />
                </Col>
            </Grid>
        </>
    )
}
