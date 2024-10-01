import { Grid } from '@tremor/react'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse,
} from '../../../../../api/api'
import OnboardCard from '../../../../../components/Cards/OnboardCard'

interface IAzureSummary {
    principalsSummary:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListCredentialResponse
        | undefined
    principalsLoading: boolean
    metricsLoading: boolean
    subscriptionsSummary:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse
        | undefined
    subscriptionsLoading: boolean
    metrics: GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics | undefined
}

export default function AzureSummary({
    principalsSummary,
    metricsLoading,
    metrics,
    principalsLoading,
    subscriptionsSummary,
    subscriptionsLoading,
}: IAzureSummary) {
    return (
        <Grid numItems={3} className="w-full gap-4 mt-6 mb-10">
            <OnboardCard
                title="Active supscriptions"
                active={metrics?.connectionsEnabled}
                inProgress={metrics?.inProgressConnections}
                healthy={metrics?.healthyConnections}
                unhealthy={metrics?.unhealthyConnections}
                loading={metricsLoading}
            />
            <SummaryCard
                title="Service Principals"
                metric={principalsSummary?.totalCredentialCount}
                loading={principalsLoading}
            />
        </Grid>
    )
}
