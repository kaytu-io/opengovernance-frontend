import { useEffect, useState } from 'react'
import { Card, DeltaType, Flex, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { priceDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { badgeDelta } from '../../../../../utilities/deltaType'
import { dateDisplay } from '../../../../../utilities/dateDisplay'

const getConnections = (con: any) => {
    if (con.provider.length) {
        return con.provider
    }
    if (con.connections.length === 1) {
        return con.connections[0]
    }
    if (con.connections.length) {
        return `${con.connections.length} accounts`
    }
    return 'all accounts'
}

export default function GrowthTrend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [growthDeltaType, setGrowthDeltaType] =
        useState<DeltaType>('unchanged')
    const [growthDelta, setGrowthDelta] = useState(0)
    const query = {
        ...(selectedConnections.provider.length && {
            connector: [selectedConnections.provider],
        }),
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString())
                .endOf('day')
                .unix()
                .toString(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
    }
    const { response: costTrend, isLoading } =
        useInventoryApiV2CostTrendList(query)
    const fixTime = (data: any) => {
        const result: any = []
        if (data === undefined) {
            return result
        }
        const keys = Object.keys(data)
        for (let j = 0; j < keys.length; j += 1) {
            const item = keys[j]
            const temp: any = {}
            const title = getConnections(selectedConnections)
            temp[title] = data[item].count
            temp.date = dateDisplay(data[item].date)
            result.push(temp)
        }
        return result
    }
    const findDeltaType = (data: any) => {
        if (data && data.length > 1) {
            const first = data[0].count
            const last = data[data.length - 1].count
            if (first > last) {
                setGrowthDeltaType('moderateDecrease')
                setGrowthDelta(Math.abs(last - first))
            } else if (first < last) {
                setGrowthDeltaType('moderateIncrease')
                setGrowthDelta(Math.abs(last - first))
            } else {
                setGrowthDeltaType('unchanged')
                setGrowthDelta(0)
            }
        }
    }

    const sortedTrend = () => {
        return costTrend?.sort((a, b) => {
            const au = dayjs(a.date).unix()
            const bu = dayjs(b.date).unix()
            if (au === bu) {
                return 0
            }
            return au > bu ? 1 : -1
        })
    }

    useEffect(() => {
        fixTime(costTrend)
        findDeltaType(costTrend)
    }, [costTrend])

    return (
        <Card className="mb-3">
            <Flex justifyContent="start" className="gap-x-2">
                <Title>Overall Spend Trend </Title>
                {costTrend &&
                    costTrend.length > 0 &&
                    badgeDelta(
                        sortedTrend()?.at(0)?.count,
                        sortedTrend()?.at(costTrend.length - 1)?.count
                    )}
            </Flex>
            {isLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    className="mt-3"
                    index="date"
                    type="line"
                    yAxisWidth={120}
                    categories={[getConnections(selectedConnections)]}
                    showLegend={false}
                    data={fixTime(sortedTrend()) || []}
                    showAnimation
                    valueFormatter={priceDisplay}
                />
            )}
        </Card>
    )
}
