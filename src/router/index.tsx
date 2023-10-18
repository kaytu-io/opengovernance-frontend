import { Navigate, Route, Routes } from 'react-router-dom'
import Infrastructure from '../pages/Infrastructure'
import NotFound from '../pages/Errors'
import { AuthenticationGuard } from '../components/Auth0/authentication-guard'
import { CallbackPage } from '../pages/Callback'
import Settings from '../pages/Settings'
import Workspaces from '../pages/Workspaces'
import Logout from '../pages/Logout'
import Spend from '../pages/Spend'
import Integrations from '../pages/Integrations'
import ConnectorDetail from '../pages/Integrations/ConnectorDetail'
import Compliance from '../pages/Governance/Compliance'
import BenchmarkSummary from '../pages/Governance/Compliance/BenchmarkSummary'
import Home from '../pages/Home'
import Stack from '../pages/Stack'
import Finder from '../pages/Finder'
import AssetDetail from '../pages/Infrastructure/Details/Tabs/CloudAccounts'
import Single from '../pages/Infrastructure/Single'
import SingleSpend from '../pages/Spend/Single'
import ServiceAdvisor from '../pages/Governance/ServiceAdvisor'
import InsightDetails from '../pages/Insights/Details'
import InsightList from '../pages/Insights/InsightList'
import BenchmarkDetails from '../pages/Governance/Compliance/BenchmarkSummary/Details'
import SpendDetails from '../pages/Spend/Details'
import InfrastructureDetails from '../pages/Infrastructure/Details'

const routes = [
    {
        key: 'url',
        path: '/',
        element: <Navigate to="/workspaces" replace />,
    },
    {
        key: 'ws name',
        path: '/:ws',
        element: <Navigate to="home" />,
    },
    {
        key: 'callback',
        path: '/callback',
        element: <CallbackPage />,
    },
    {
        key: 'logout',
        path: '/logout',
        element: <Logout />,
    },
    {
        key: '*',
        path: '*',
        element: <NotFound />,
    },
]

const authRoutes = [
    {
        key: 'workspaces',
        path: '/workspaces',
        component: Workspaces,
    },
    {
        key: 'infrastructure',
        path: '/:ws/infrastructure',
        component: Infrastructure,
    },
    {
        key: 'infrastructure single',
        path: '/:ws/infrastructure/:id',
        component: Single,
    },
    {
        key: 'infrastructure single metric',
        path: '/:ws/infrastructure/:id/:metric',
        component: Single,
    },
    {
        key: 'infrastructure metrics',
        path: '/:ws/infrastructure/infrastructure-details',
        component: InfrastructureDetails,
    },
    {
        key: 'infrastructure single 2',
        path: '/:ws/infrastructure/infrastructure-details/:id',
        component: Single,
    },
    {
        key: 'infrastructure single metric 2',
        path: '/:ws/infrastructure/infrastructure-details/:id/:metric',
        component: Single,
    },
    {
        key: 'spend',
        path: '/:ws/spend',
        component: Spend,
    },
    {
        key: 'spend single',
        path: '/:ws/spend/:id',
        component: SingleSpend,
    },
    {
        key: 'spend single metric',
        path: '/:ws/spend/:id/:metric',
        component: SingleSpend,
    },
    {
        key: 'spend metrics',
        path: '/:ws/spend/spend-details',
        component: SpendDetails,
    },
    {
        key: 'spend single 2',
        path: '/:ws/spend/spend-details/:id',
        component: SingleSpend,
    },
    {
        key: 'spend single metric 2',
        path: '/:ws/spend/spend-details/:id/:metric',
        component: SingleSpend,
    },
    {
        key: 'insights',
        path: '/:ws/insights',
        component: InsightList,
    },
    {
        key: 'insight detail',
        path: '/:ws/insights/:id',
        component: InsightDetails,
    },
    {
        key: 'integrations',
        path: '/:ws/integrations',
        component: Integrations,
    },
    {
        key: 'connector detail',
        path: '/:ws/integrations/:connector',
        component: ConnectorDetail,
    },
    {
        key: 'settings page',
        path: '/:ws/settings',
        component: Settings,
    },
    {
        key: 'compliance',
        path: '/:ws/compliance',
        component: Compliance,
    },
    {
        key: 'benchmark summary',
        path: '/:ws/compliance/:id',
        component: BenchmarkSummary,
    },
    {
        key: 'benchmark detail',
        path: '/:ws/compliance/:id/details',
        component: BenchmarkDetails,
    },
    {
        key: 'service advisor',
        path: '/:ws/service-advisor',
        component: ServiceAdvisor,
    },
    {
        key: 'service advisor detail',
        path: '/:ws/service-advisor/:id',
        component: BenchmarkSummary,
    },
    {
        key: 'home',
        path: '/:ws/home',
        component: Home,
    },
    {
        key: 'deployment',
        path: '/:ws/deployment',
        component: Stack,
    },
    {
        key: 'finder',
        path: '/:ws/finder',
        component: Finder,
    },
]

export default function Router() {
    return (
        <Routes>
            {routes.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={route.element}
                />
            ))}
            {authRoutes.map((route) => (
                <Route
                    key={route.key}
                    path={route.path}
                    element={
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        <AuthenticationGuard component={route.component} />
                    }
                />
            ))}
        </Routes>
    )
}
