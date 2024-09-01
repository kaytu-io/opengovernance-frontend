import { Badge, Card, Flex, Text } from '@tremor/react'
import { Link, useNavigate } from 'react-router-dom'
import {
    BanknotesIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    CubeIcon,
    DocumentChartBarIcon,
    ExclamationCircleIcon,
    Squares2X2Icon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    PuzzlePieceIcon,
    RectangleStackIcon,
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon,
    DocumentMagnifyingGlassIcon,
    ArrowUpCircleIcon,
} from '@heroicons/react/24/outline'
import { useAtom, useAtomValue } from 'jotai'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { previewAtom, sideBarCollapsedAtom } from '../../../store'
import { KaytuIcon, KaytuIconBig } from '../../../icons/icons'
import Utilities from './Utilities'
import {
    useInventoryApiV2AnalyticsCountList,
    useInventoryApiV2AnalyticsSpendCountList,
} from '../../../api/inventory.gen'
import { useComplianceApiV1FindingsCountList } from '../../../api/compliance.gen'
import { useIntegrationApiV1ConnectionsCountList } from '../../../api/integration.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'
import Workspaces from './Workspaces'
import AnimatedAccordion from '../../AnimatedAccordion'
import { setAuthHeader } from '../../../api/ApiConfig'
import { searchAtom } from '../../../utilities/urlstate'
import { useAuth } from '../../../utilities/auth'

const badgeStyle = {
    color: '#fff',
    borderRadius: '8px',
    backgroundColor: '#15395F80',
}

interface ISidebar {
    workspace: string | undefined
    currentPage: string
}

interface ISidebarItem {
    name: string
    page: string | string[]
    icon?: any
    isLoading?: boolean
    count?: number | string
    error?: any
    isPreview?: boolean
    children?: ISidebarItem[]
    selected?: string
}

export default function Sidebar({ workspace, currentPage }: ISidebar) {
    const navigate = useNavigate()
    const { isAuthenticated, getAccessTokenSilently } = useAuth()
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const preview = useAtomValue(previewAtom)
    const {
        response: spendCount,
        isLoading: spendCountIsLoading,
        error: spendCountErr,
        sendNow: sendSpend,
    } = useInventoryApiV2AnalyticsSpendCountList({}, false, workspace)
    const {
        response: assetCount,
        isLoading: assetsIsLoading,
        error: assetCountErr,
        sendNow: sendAssets,
    } = useInventoryApiV2AnalyticsCountList({}, false, workspace)
    const {
        response: findingsCount,
        isLoading: findingsIsLoading,
        error: findingsErr,
        sendNow: sendFindings,
    } = useComplianceApiV1FindingsCountList({}, {}, false, workspace)
    const {
        response: connectionCount,
        isExecuted: connectionsIsExecuted,
        isLoading: connectionsIsLoading,
        error: connectionsErr,
        sendNow: sendConnections,
    } = useIntegrationApiV1ConnectionsCountList({}, {}, false, workspace)

    const searchParams = useAtomValue(searchAtom)

    const isCurrentPage = (page: string | string[] | undefined): boolean => {
        if (Array.isArray(page)) {
            return page.map((p) => isCurrentPage(p)).includes(true)
        }

        if (page?.includes('?')) {
            const pageParams = new URLSearchParams(
                page?.substring(page?.indexOf('?'))
            )

            const locUrl = new URL(window.location.href)
            const locParams = new URLSearchParams(locUrl.search)

            let ok = true
            pageParams.forEach((value, key) => {
                if (locParams.get(key) !== value) {
                    ok = false
                }
            })
            return currentPage === page?.substring(0, page?.indexOf('?')) && ok
        }

        return currentPage === page
    }

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then((accessToken) => {
                    setAuthHeader(accessToken)
                    sendSpend()
                    sendAssets()
                    sendFindings()
                    sendConnections()
                    // fetchDashboardToken()
                })
                .catch((e) => {
                    console.log('====> failed to get token due to', e)
                })
        }
    }, [isAuthenticated, workspace])

    const navigation: () => ISidebarItem[] = () => {
        if (
            connectionsIsExecuted &&
            !connectionsIsLoading &&
            (connectionCount?.count || 0) === 0
        ) {
            if (currentPage !== 'integrations' && currentPage !== 'settings') {
                navigate(`/ws/${workspace}/integrations`)
            }
            return [
                {
                    name: 'Integrations',
                    page: 'integrations',
                    icon: PuzzlePieceIcon,
                    isLoading: connectionsIsLoading,
                    count: numericDisplay(connectionCount?.count) || 0,
                    error: connectionsErr,
                    isPreview: false,
                },
                {
                    name: 'Settings',
                    page: 'settings',
                    icon: Cog6ToothIcon,
                    isPreview: false,
                },
            ]
        }
        return [
            {
                name: 'Overview',
                page: 'overview',
                icon: Squares2X2Icon,
                isPreview: false,
            },
            {
                name: 'SCORE',
                page: 'score',
                icon: DocumentChartBarIcon,
                isPreview: false,
            },
            {
                name: 'Infrastructure',
                page: [
                    'infrastructure',
                    'infrastructure-cloud-accounts',
                    'infrastructure-metrics',
                ],
                icon: CubeIcon,
                children: [
                    {
                        name: 'Summary',
                        page: 'infrastructure',
                        isPreview: false,
                        isLoading: false,
                        count: undefined,
                        error: false,
                    },
                    {
                        name: 'Cloud Accounts',
                        page: 'infrastructure-cloud-accounts',
                        isPreview: false,
                        isLoading: assetsIsLoading,
                        count: numericDisplay(assetCount?.connectionCount) || 0,
                        error: assetCountErr,
                    },
                    {
                        name: 'Cloud Services',
                        page: 'infrastructure-metrics',
                        isPreview: false,
                        isLoading: assetsIsLoading,
                        count: numericDisplay(assetCount?.metricCount) || 0,
                        error: assetCountErr,
                    },
                ],
                isPreview: false,
            },
            {
                name: 'Spend',
                page: ['spend', 'spend-accounts', 'spend-metrics'],
                icon: BanknotesIcon,
                children: [
                    {
                        name: 'Summary',
                        page: 'spend',
                        isPreview: false,
                        isLoading: false,
                        count: undefined,
                        error: false,
                    },
                    {
                        name: 'Cloud Accounts',
                        page: 'spend-accounts',
                        isPreview: false,
                        isLoading: spendCountIsLoading,
                        count: numericDisplay(spendCount?.connectionCount) || 0,
                        error: spendCountErr,
                    },
                    {
                        name: 'Services',
                        page: 'spend-metrics',
                        isPreview: false,
                        isLoading: spendCountIsLoading,
                        count: numericDisplay(spendCount?.metricCount) || 0,
                        error: spendCountErr,
                    },
                ],
                isPreview: false,
            },
            {
                name: 'Policies',
                icon: ClipboardDocumentCheckIcon,
                page: 'policies',
                isPreview: false,
                isLoading: false,
                count: undefined,
                error: false,
            },
            {
                name: 'Findings',
                icon: DocumentMagnifyingGlassIcon,
                page: 'findings',
                children: [
                    {
                        name: 'All Findings',
                        page: 'findings?tab=0',
                        isLoading: findingsIsLoading,
                        count: numericDisplay(findingsCount?.count) || 0,
                        error: findingsErr,
                    },
                    {
                        name: 'Resource Summary',
                        page: 'findings?tab=1',
                    },
                    {
                        name: 'Drift Events',
                        page: 'findings?tab=2',
                    },
                    {
                        name: 'Account Posture',
                        page: 'findings?tab=3',
                    },
                    {
                        name: 'Control Summary',
                        page: 'findings?tab=4',
                    },
                ],
            },
            {
                name: 'Security',
                icon: ShieldCheckIcon,
                page: 'security-overview',
                isPreview: false,
                isLoading: false,
                count: undefined,
                error: false,
            },
            {
                name: 'Query',
                page: 'query',
                icon: MagnifyingGlassIcon,
                isPreview: false,
            },
            {
                name: 'Integrations',
                page: 'integrations',
                icon: PuzzlePieceIcon,
                isLoading: connectionsIsLoading,
                count: numericDisplay(connectionCount?.count) || 0,
                error: connectionsErr,
                isPreview: false,
            },
            {
                name: 'Workload Optimizer',
                page: 'workload-optimizer',
                icon: ArrowUpCircleIcon,
                isPreview: true,
                isLoading: false,
                count: undefined,
                error: spendCountErr,
            },
            {
                name: 'Stacks',
                page: 'stacks',
                icon: RectangleStackIcon,
                isPreview: true,
            },
            {
                name: 'Dashboards',
                page: 'resource-collection',
                icon: ArrowUpCircleIcon,
                isPreview: true,
            },
            {
                name: 'Settings',
                page: 'settings',
                icon: Cog6ToothIcon,
                isPreview: false,
            },
        ]
    }

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-50 !max-h-screen h-full w-fit pt-4 bg-kaytu-950 dark:bg-gray-950 relative border-r border-r-gray-700"
        >
            <Flex
                flexDirection="col"
                justifyContent="start"
                className={`h-full ${collapsed ? 'w-fit' : 'w-72'}`}
            >
                <Flex
                    justifyContent={collapsed ? 'center' : 'between'}
                    className={`pb-[17px] pt-[6px] ${collapsed ? '' : 'px-5'}`}
                >
                    {collapsed ? <KaytuIcon /> : <KaytuIconBig />}
                    {!collapsed && (
                        <ChevronLeftIcon
                            className="h-5 text-gray-400 cursor-pointer"
                            onClick={() => {
                                setCollapsed(true)
                                localStorage.collapse = 'true'
                            }}
                        />
                    )}
                </Flex>
                {/* <Flex
                    justifyContent="center"
                    className={collapsed ? 'p-0' : 'p-2'}
                >
                    <Workspaces isCollapsed={collapsed} />
                </Flex> */}
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="h-full max-h-full"
                >
                    <div
                        className={`w-full p-2 ${
                            collapsed ? '' : 'overflow-y-scroll'
                        } h-full no-scrollbar`}
                        style={{ maxHeight: 'calc(100vh - 130px)' }}
                    >
                        {!collapsed && (
                            <Text className="my-2 !text-xs">OVERVIEW</Text>
                        )}
                        {collapsed && (
                            <ChevronRightIcon
                                className="m-2 h-5 text-gray-400 cursor-pointer"
                                onClick={() => {
                                    setCollapsed(false)
                                    localStorage.collapse = 'false'
                                }}
                            />
                        )}
                        {navigation()
                            .filter((item) =>
                                preview === 'true'
                                    ? item
                                    : String(item.isPreview) === String(preview)
                            )
                            .map((item) =>
                                // eslint-disable-next-line no-nested-ternary
                                item.children && !collapsed ? (
                                    <div className="w-full my-1">
                                        <AnimatedAccordion
                                            defaultOpen={
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                item.children.filter(
                                                    (c: any) =>
                                                        isCurrentPage(c.page) ||
                                                        isCurrentPage(
                                                            c.selected
                                                        )
                                                ).length > 0
                                            }
                                            header={
                                                <div
                                                    className={`w-full text-gray-50 ${
                                                        collapsed
                                                            ? 'px-2'
                                                            : 'px-6'
                                                    } py-2`}
                                                >
                                                    <Flex
                                                        justifyContent="start"
                                                        className="h-full gap-2.5"
                                                    >
                                                        {item.isPreview ===
                                                        true ? (
                                                            <item.icon
                                                                className={`h-5 w-5 stroke-2 ${
                                                                    collapsed &&
                                                                    isCurrentPage(
                                                                        item.page
                                                                    )
                                                                        ? 'text-orange-200'
                                                                        : 'text-orange-400'
                                                                }`}
                                                            />
                                                        ) : (
                                                            <item.icon
                                                                className={`h-5 w-5 stroke-2 ${
                                                                    collapsed &&
                                                                    isCurrentPage(
                                                                        item.page
                                                                    )
                                                                        ? 'text-gray-200'
                                                                        : 'text-gray-400'
                                                                }`}
                                                            />
                                                        )}

                                                        <Text className="text-inherit">
                                                            {item.name}
                                                        </Text>
                                                        {item.isPreview &&
                                                            !collapsed && (
                                                                <Badge
                                                                    className="absolute right-2 top-1.5"
                                                                    style={
                                                                        badgeStyle
                                                                    }
                                                                >
                                                                    Preview
                                                                </Badge>
                                                            )}
                                                    </Flex>
                                                </div>
                                            }
                                        >
                                            {item.children.map((i) => (
                                                <Link
                                                    to={
                                                        i.page.includes('?')
                                                            ? `/ws/${workspace}/${i.page}`
                                                            : `/ws/${workspace}/${i.page}?${searchParams}`
                                                    }
                                                    className={`my-0.5 py-2 flex rounded-md relative
                                                    ${
                                                        isCurrentPage(i.page)
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                >
                                                    <Text className="ml-[54px] text-inherit">
                                                        {i.name}
                                                    </Text>
                                                    {i.count && (
                                                        <Badge
                                                            className="absolute right-2 top-1.5"
                                                            style={badgeStyle}
                                                        >
                                                            {/* eslint-disable-next-line no-nested-ternary */}
                                                            {i.isLoading ? (
                                                                <div className="animate-pulse h-1 w-4 my-2 bg-gray-700 rounded-md" />
                                                            ) : i.error ? (
                                                                <ExclamationCircleIcon className="h-5" />
                                                            ) : (
                                                                i.count
                                                            )}
                                                        </Badge>
                                                    )}
                                                    {i.isPreview && (
                                                        <div className="absolute right-2 top-1.5">
                                                            <ArrowUpCircleIcon
                                                                height={18}
                                                                color="orange"
                                                            />
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </AnimatedAccordion>
                                    </div>
                                ) : item.children && collapsed ? (
                                    <div className="w-full my-1">
                                        <Popover className="relative z-50 border-0 w-full h-[36px]">
                                            <div className="group relative">
                                                <Popover.Button id={item.name}>
                                                    <div
                                                        className={`w-full rounded-md p-2
                                                    ${
                                                        isCurrentPage(item.page)
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                    >
                                                        <item.icon
                                                            className={`h-5 w-5 stroke-2 ${
                                                                isCurrentPage(
                                                                    item.page
                                                                )
                                                                    ? 'text-gray-200'
                                                                    : 'text-gray-400'
                                                            }`}
                                                        />
                                                    </div>
                                                </Popover.Button>
                                                <div
                                                    className="absolute z-50 scale-0 transition-all rounded p-2 shadow-md bg-kaytu-950 group-hover:scale-100"
                                                    style={{
                                                        left: '50px',
                                                        top: 0,
                                                    }}
                                                >
                                                    <Text className="text-white">
                                                        {item.name}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute left-[163px] top-[1px] z-40 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                    <Card className="z-50 rounded p-2 shadow-md !ring-gray-600 w-56 bg-kaytu-950">
                                                        <Text className="ml-1 mb-3 text-white">
                                                            {item.name}
                                                        </Text>
                                                        {item.children.map(
                                                            (i) => (
                                                                <Link
                                                                    to={
                                                                        i.page.includes(
                                                                            '?'
                                                                        )
                                                                            ? `/ws/${workspace}/${i.page}`
                                                                            : `/ws/${workspace}/${i.page}?${searchParams}`
                                                                    }
                                                                    className={`my-0.5 py-2 px-4 flex justify-start rounded-md relative
                                                    ${
                                                        isCurrentPage(i.page)
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                                >
                                                                    <Text className="text-inherit">
                                                                        {i.name}
                                                                    </Text>
                                                                    {i.count && (
                                                                        <Badge
                                                                            className="absolute right-2 top-1.5"
                                                                            style={
                                                                                badgeStyle
                                                                            }
                                                                        >
                                                                            {/* eslint-disable-next-line no-nested-ternary */}
                                                                            {i.isLoading ? (
                                                                                <div className="animate-pulse h-1 w-4 my-2 bg-gray-700 rounded-md" />
                                                                            ) : i.error ? (
                                                                                <ExclamationCircleIcon className="h-5" />
                                                                            ) : (
                                                                                i.count
                                                                            )}
                                                                        </Badge>
                                                                    )}
                                                                    {i.isPreview && (
                                                                        <Badge
                                                                            className="absolute right-2 top-1.5"
                                                                            style={
                                                                                badgeStyle
                                                                            }
                                                                        >
                                                                            Preview
                                                                        </Badge>
                                                                    )}
                                                                </Link>
                                                            )
                                                        )}
                                                    </Card>
                                                </Popover.Panel>
                                            </Transition>
                                        </Popover>
                                    </div>
                                ) : (
                                    <div className="w-full my-1">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <Link
                                            to={
                                                Array.isArray(item.page)
                                                    ? ''
                                                    : `/ws/${workspace}/${item.page}?${searchParams}`
                                            }
                                            className={`w-full relative px-6 py-2 flex items-center gap-2.5 rounded-md
                                                        ${
                                                            isCurrentPage(
                                                                item.page
                                                            ) ||
                                                            (collapsed &&
                                                                isCurrentPage(
                                                                    item.page
                                                                ))
                                                                ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                                : 'text-gray-50 hover:bg-kaytu-800'
                                                        }
                                                        ${
                                                            collapsed
                                                                ? '!p-2'
                                                                : ''
                                                        }`}
                                        >
                                            <div className="group relative">
                                                {item.isPreview === true ? (
                                                    <item.icon
                                                        className={`h-5 w-5 stroke-2 ${
                                                            isCurrentPage(
                                                                item.page
                                                            ) ||
                                                            (collapsed &&
                                                                isCurrentPage(
                                                                    item.page
                                                                ))
                                                                ? 'text-orange-200'
                                                                : 'text-orange-400'
                                                        }`}
                                                    />
                                                ) : (
                                                    <item.icon
                                                        className={`h-5 w-5 stroke-2 ${
                                                            isCurrentPage(
                                                                item.page
                                                            ) ||
                                                            (collapsed &&
                                                                isCurrentPage(
                                                                    item.page
                                                                ))
                                                                ? 'text-gray-200'
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                )}
                                                {collapsed && (
                                                    <div
                                                        className="absolute z-50 scale-0 transition-all rounded p-2 shadow-md bg-kaytu-950 group-hover:scale-100"
                                                        style={{
                                                            left: '43px',
                                                            top: '-8px',
                                                        }}
                                                    >
                                                        <Text className="text-white">
                                                            {item.name}
                                                        </Text>
                                                    </div>
                                                )}
                                            </div>
                                            {!collapsed && (
                                                <Text className="text-inherit">
                                                    {item.name}
                                                </Text>
                                            )}
                                            {item.count && !collapsed && (
                                                <Badge
                                                    className="absolute right-2 top-1.5"
                                                    style={badgeStyle}
                                                >
                                                    {/* eslint-disable-next-line no-nested-ternary */}
                                                    {item.isLoading ? (
                                                        <div className="animate-pulse h-1 w-4 my-2 bg-gray-700 rounded-md" />
                                                    ) : item.error ? (
                                                        <ExclamationCircleIcon className="h-5" />
                                                    ) : (
                                                        item.count
                                                    )}
                                                </Badge>
                                            )}
                                        </Link>
                                    </div>
                                )
                            )}
                    </div>
                </Flex>
                <Utilities isCollapsed={collapsed} workspace={workspace} />
            </Flex>
        </Flex>
    )
}
