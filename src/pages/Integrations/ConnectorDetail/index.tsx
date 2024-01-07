import { Button, Flex, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import { timeAtom } from '../../../store'
import AWSTabs from './AWS/Tabs'
import AWSSummary from './AWS/Summary'
import AzureSummary from './Azure/Summary'
import AzureTabs from './Azure/Tabs'
import { StringToProvider } from '../../../types/provider'
import {
    useIntegrationApiV1ConnectionsSummariesList,
    useIntegrationApiV1ConnectorsMetricsList,
    useIntegrationApiV1CredentialsList,
} from '../../../api/integration.gen'

export default function ConnectorDetail() {
    const navigate = useNavigate()
    const { connector } = useParams()

    const activeTimeRange = useAtomValue(timeAtom)
    const provider = StringToProvider(connector || '')
    const { response: accounts, isLoading: isAccountsLoading } =
        useIntegrationApiV1ConnectionsSummariesList({
            ...(provider !== '' && {
                connector: [provider],
            }),
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 10000,
            pageNumber: 1,
        })
    const { response: credentials, isLoading: isCredentialLoading } =
        useIntegrationApiV1CredentialsList({
            connector: provider,
        })
    const { response: topMetrics, isLoading: metricsLoading } =
        useIntegrationApiV1ConnectorsMetricsList({
            connector: provider !== '' ? [provider] : [],
        })

    return (
        <Layout currentPage="integrations" breadCrumb={[connector]}>
            <Flex flexDirection="col" alignItems="start">
                <Flex flexDirection="row">
                    <Title className="font-semibold">{connector}</Title>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('./resourcetypes')}
                    >
                        <Cog8ToothIcon className="w-6" />
                    </Button>
                </Flex>
                {connector === 'AWS' ? (
                    <>
                        <AWSSummary
                            metrics={topMetrics}
                            metricsLoading={metricsLoading}
                            credential={credentials}
                            credentialLoading={isCredentialLoading}
                        />
                        <AWSTabs
                            accounts={accounts?.connections || []}
                            organizations={credentials?.credentials || []}
                            loading={isAccountsLoading}
                        />
                    </>
                ) : (
                    <>
                        <AzureSummary
                            principalsSummary={credentials}
                            metrics={topMetrics}
                            metricsLoading={metricsLoading}
                            principalsLoading={isCredentialLoading}
                            subscriptionsSummary={accounts}
                            subscriptionsLoading={isAccountsLoading}
                        />
                        <AzureTabs
                            principals={credentials?.credentials || []}
                            subscriptions={accounts?.connections || []}
                            loading={isAccountsLoading}
                        />
                    </>
                )}
            </Flex>
        </Layout>
    )
}
