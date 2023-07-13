import { Flex, Grid } from '@tremor/react'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import GrowthTrend from './GrowthTrend'
import CardWithList from '../../../../components/Cards/CardWithList'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import {
    useInventoryApiV2ResourcesRegionsSummaryList,
    useInventoryApiV2ServicesMetricList,
} from '../../../../api/inventory.gen'
import Spinner from '../../../../components/Spinner'
import { filterAtom, timeAtom } from '../../../../store'
import { percentageByChange } from '../../../../utilities/deltaType'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}
export default function TrendsTab({ categories }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const queryTop5ConnectionsWithSort = (
        sortBy?:
            | 'onboard_date'
            | 'resource_count'
            | 'cost'
            | 'growth'
            | 'growth_rate'
            | 'cost_growth'
            | 'cost_growth_rate'
    ) => {
        return {
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.start.toString()).unix(),
            endTime: dayjs(activeTimeRange.end.toString()).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const {
        response: accountsConsumption,
        isLoading: loadingAccountsConsumption,
    } = useOnboardApiV1ConnectionsSummaryList(
        queryTop5ConnectionsWithSort('resource_count')
    )

    const { response: accountsGrowth, isLoading: loadingAccountsGrowth } =
        useOnboardApiV1ConnectionsSummaryList(
            queryTop5ConnectionsWithSort('growth_rate')
        )

    const queryTop5ServicesWithSort = (
        sortBy?: 'name' | 'count' | 'growth' | 'growth_rate'
    ) => {
        return {
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
            endTime: dayjs(activeTimeRange.end.toString()).unix().toString(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const {
        response: servicesConsumption,
        isLoading: loadingServicesConsumption,
    } = useInventoryApiV2ServicesMetricList(queryTop5ServicesWithSort('count'))

    const { response: servicesGrowth, isLoading: loadingServicesGrowth } =
        useInventoryApiV2ServicesMetricList(
            queryTop5ServicesWithSort('growth_rate')
        )

    const queryTop5RegionsWithSort = (
        sortBy?: 'resource_count' | 'growth' | 'growth_rate'
    ) => {
        return {
            connector: [selectedConnections.provider],
            connectionId: selectedConnections.connections,
            startTime: dayjs(activeTimeRange.start.toString()).unix(),
            endTime: dayjs(activeTimeRange.end.toString()).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy,
        }
    }

    const { response: regionConsumption, isLoading: loadingRegionConsumption } =
        useInventoryApiV2ResourcesRegionsSummaryList(
            queryTop5RegionsWithSort('resource_count')
        )

    const { response: regionGrowth, isLoading: loadingRegionGrowth } =
        useInventoryApiV2ResourcesRegionsSummaryList(
            queryTop5RegionsWithSort('growth_rate')
        )

    if (
        loadingAccountsConsumption ||
        loadingAccountsGrowth ||
        loadingServicesConsumption ||
        loadingServicesGrowth ||
        loadingRegionConsumption ||
        loadingRegionGrowth
    ) {
        return (
            <Flex justifyContent="center" className="mt-56">
                <Spinner />
            </Flex>
        )
    }

    const consumptionData = () => {
        const AccountData =
            accountsConsumption?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: item.resourceCount,
                }
            }) || []
        const ServicesData =
            servicesConsumption?.services?.map((item) => {
                return {
                    name: item.service_label,
                    value: item.resource_count,
                }
            }) || []
        const RegionData =
            regionConsumption?.regions?.map((item) => {
                return {
                    name: item.location,
                    value: item.resourceCount,
                }
            }) || []
        return {
            Accounts: AccountData,
            Services: ServicesData,
            Regions: RegionData,
        }
    }

    const growthData = () => {
        const AccountData =
            accountsGrowth?.connections?.map((item) => {
                return {
                    name: item.providerConnectionName,
                    value: `${percentageByChange(
                        item.oldResourceCount,
                        item.resourceCount
                    )} %`,
                }
            }) || []
        const ServicesData =
            servicesGrowth?.services?.map((item) => {
                return {
                    name: item.service_label,
                    value: `${percentageByChange(
                        item.old_resource_count,
                        item.resource_count
                    )} %`,
                }
            }) || []
        const RegionData =
            regionGrowth?.regions?.map((item) => {
                return {
                    name: item.location,
                    value: `${percentageByChange(
                        item.resourceOldCount,
                        item.resourceCount
                    )} %`,
                }
            }) || []
        return {
            Accounts: AccountData,
            Services: ServicesData,
            Regions: RegionData,
        }
    }

    return (
        <div className="mt-5">
            <GrowthTrend categories={categories} />
            <Grid numItemsMd={2} className="mt-3 gap-3 flex justify-between">
                <div className="w-full">
                    <CardWithList
                        title="Top by Consumption"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={consumptionData()}
                    />
                </div>
                <div className="w-full">
                    <CardWithList
                        title="Top by Growth"
                        tabs={['Accounts', 'Services', 'Regions']}
                        data={growthData()}
                        isPercentage
                    />
                </div>
            </Grid>
        </div>
    )
}
