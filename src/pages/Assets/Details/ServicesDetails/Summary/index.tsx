import {
    BadgeDelta,
    Bold,
    Card,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2AnalyticsMetricList } from '../../../../../api/inventory.gen'
import { filterAtom, timeAtom } from '../../../../../store'
import Spinner from '../../../../../components/Spinner'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../../utilities/deltaType'

type IProps = {
    totalServices?: number
    totalServicesLoading: boolean
}
export default function Summary({
    totalServices,
    totalServicesLoading,
}: IProps) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: topServices, isLoading: topServicesLoading } =
        useInventoryApiV2AnalyticsMetricList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            pageSize: 5,
            pageNumber: 1,
            endTime: activeTimeRange.end.unix(),
            sortBy: 'count',
        })
    const {
        response: topFastestServices,
        isLoading: topFastestServicesLoading,
    } = useInventoryApiV2AnalyticsMetricList({
        connector: [selectedConnections?.provider],
        connectionId: selectedConnections?.connections,
        pageSize: 5,
        pageNumber: 1,
        endTime: activeTimeRange.end.unix(),
        sortBy: 'growth_rate',
    })

    return (
        <Flex flexDirection="col" className="mt-6">
            <Flex>
                <Metric>Services</Metric>
                <Flex justifyContent="end" alignItems="end">
                    <Metric className="mr-2">
                        {totalServicesLoading ? (
                            <Spinner />
                        ) : (
                            numericDisplay(totalServices)
                        )}
                    </Metric>
                    <Text>Total Services</Text>
                </Flex>
            </Flex>
            <Grid numItems={1} numItemsMd={2} className="w-full gap-4 mt-3">
                <Card key="TopXServices" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">Popular Services</Title>
                    </Flex>
                    {topServicesLoading ? (
                        <Spinner className="py-24" />
                    ) : (
                        <List className="mt-2 h-full">
                            {topServices?.metrics?.map((thing) => (
                                <ListItem key={thing.name} className="py-3">
                                    <Text>{thing.name}</Text>
                                    <Bold>{numericDisplay(thing.count)}</Bold>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
                <Card key="TopXFastest" className="h-fit">
                    <Title className="truncate">
                        Top Fast-Growing Services
                    </Title>
                    {topFastestServicesLoading ? (
                        <Spinner className="py-24" />
                    ) : (
                        <List className="mt-2 h-full">
                            {topFastestServices?.metrics?.map((thing) => (
                                <ListItem key={thing.name}>
                                    <Text>{thing.name}</Text>
                                    <Flex justifyContent="end">
                                        <Bold>
                                            {numericDisplay(thing.count)}
                                        </Bold>
                                        <BadgeDelta
                                            className="ml-3"
                                            deltaType={badgeTypeByDelta(
                                                thing.old_count,
                                                thing.count
                                            )}
                                        >
                                            {`${percentageByChange(
                                                thing.old_count,
                                                thing.count
                                            )}%`}
                                        </BadgeDelta>
                                    </Flex>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Card>
            </Grid>
        </Flex>
    )
}
