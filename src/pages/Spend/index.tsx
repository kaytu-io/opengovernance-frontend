import React, { useState } from 'react'
import {
    Card,
    Col,
    Flex,
    Grid,
    Metric,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import DateRangePicker from '../../components/DateRangePicker'
import Menu from '../../components/Menu'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import { filterAtom, spendTimeAtom } from '../../store'
import SummaryMetrics from './SummaryMetrics'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'

export default function Spend() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        pageSize: 5000,
        pageNumber: 1,
    }

    const { response: costTrend, isLoading } =
        useInventoryApiV2AnalyticsSpendTrendList(query)

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostError,
        sendNow: serviceCostSendNow,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)

    const {
        response: accountCostResponse,
        isLoading: accountCostLoading,
        error: accountCostError,
        sendNow: accountCostSendNow,
    } = useOnboardApiV1ConnectionsSummaryList({
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections.connections,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
        pageSize: 5000,
        pageNumber: 1,
        sortBy: 'cost',
    })

    console.log(costTrend)

    return (
        <Menu currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Spend</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker isSpend />
                    <ConnectionList />
                </Flex>
            </Flex>
            <SummaryMetrics
                accountCostResponse={accountCostResponse}
                accountCostLoading={accountCostLoading}
                serviceCostResponse={serviceCostResponse}
                serviceCostLoading={serviceCostLoading}
            />
            <Card>
                <Grid numItems={1} numItemsMd={3}>
                    <Col numColSpan={2}>
                        <Title className="font-semibold">Spend Trend</Title>
                    </Col>
                    <Select
                        value={selectedChart}
                        onValueChange={(v) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            setSelectedChart(v)
                        }}
                    >
                        <SelectItem value="line">
                            <Text>Line Chart</Text>
                        </SelectItem>
                        <SelectItem value="area">
                            <Text>Area Chart</Text>
                        </SelectItem>
                        <SelectItem value="bar">
                            <Text>Bar Chart</Text>
                        </SelectItem>
                    </Select>
                </Grid>
                <Chart
                    labels={['sample 1', 'sample 2']}
                    chartData={[1, 2]}
                    chartType={selectedChart}
                />
            </Card>
        </Menu>
    )
}
