import {
    Bold,
    Button,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Text,
} from '@tremor/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { getErrorMessage } from '../../types/apierror'
import { GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesMeter } from '../../api/api'
import { useSubscriptionApiV1MeteringListCreate } from '../../api/subscription.gen'
import TopHeader from '../../components/Layout/Header'
import { defaultTime, useUrlDateRangeState } from '../../utilities/urlstate'

function BillingItems() {
    const { ws } = useParams()
    const { value: activeTimeRange } = useUrlDateRangeState(
        defaultTime(ws || '')
    )

    const { response, isLoading, error, sendNow } =
        useSubscriptionApiV1MeteringListCreate({
            start_time_epoch_millis: activeTimeRange.start.unix() * 1000,
            end_time_epoch_millis: activeTimeRange.end.unix() * 1000,
        })
    const errMsg = getErrorMessage(error)

    if (isLoading) {
        return (
            <Col numColSpan={4}>
                <Spinner />
            </Col>
        )
    }

    if (errMsg.length > 0) {
        return (
            <Col numColSpan={4}>
                <Flex
                    flexDirection="row"
                    justifyContent="start"
                    className="w-full"
                >
                    <Text className="text-red-500">
                        Failed to load meters due to: {errMsg}
                    </Text>
                    <Button
                        variant="secondary"
                        color="rose"
                        size="xs"
                        className="ml-5"
                        onClick={sendNow}
                    >
                        <Flex flexDirection="row">
                            <ArrowPathIcon className="w-4 mr-2" />
                            Retry
                        </Flex>
                    </Button>
                </Flex>
            </Col>
        )
    }

    const value = (
        meters: GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesMeter[]
    ) => {
        const v = meters
            .map((meter) => meter.value || 0)
            .reduce((sum, current) => sum + current, 0)
        return v
    }

    const dataPerWorkspace = () => {
        const map = new Map<
            string,
            GithubComKaytuIoKaytuEngineServicesSubscriptionApiEntitiesMeter[]
        >()
        response?.meters?.forEach((meter) => {
            const ms = map.get(String(meter.type)) || []
            ms.push(meter)
            map.set(String(meter.type), ms)
        })
        return Array.from(map.entries())
    }

    return (
        <>
            {dataPerWorkspace().map((meter) => {
                const title = String(meter[0])
                const v = value(meter[1])
                if (v === 0) {
                    return null
                }

                return (
                    <Col>
                        <Card key={title}>
                            <Text>{title}</Text>
                            <Metric>{v.toFixed(0)}</Metric>
                            <Flex className="mt-6">
                                <Text>
                                    <Bold>Workspace</Bold>
                                </Text>
                                <Text>
                                    <Bold>Usage</Bold>
                                </Text>
                            </Flex>
                            <List className="mt-1">
                                {meter[1].map((wsm) => (
                                    <ListItem key={wsm.workspaceName}>
                                        <Flex
                                            justifyContent="start"
                                            className="truncate space-x-2.5"
                                        >
                                            <Text className="truncate">
                                                {wsm.workspaceName}
                                            </Text>
                                        </Flex>
                                        <Text>{wsm.value?.toFixed(0)}</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Col>
                )
            })}
        </>
    )
}

export default function Billing() {
    return (
        <>
            <TopHeader supportedFilters={['Date']} initialFilters={['Date']} />
            <Grid numItems={4} className="gap-4">
                <BillingItems />
            </Grid>
        </>
    )
}
