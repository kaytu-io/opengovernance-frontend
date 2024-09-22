import { Button, Card, Flex, Grid, Tab, TabGroup, TabList, Text, Title } from '@tremor/react'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline'
import ConnectorCard from '../../components/Cards/ConnectorCard'
import Spinner from '../../components/Spinner'
import { useIntegrationApiV1ConnectorsList } from '../../api/integration.gen'
import TopHeader from '../../components/Layout/Header'

export default function Integrations() {
    const [pageNo, setPageNo] = useState<number>(0)
    const { response: responseConnectors, isLoading: connectorsLoading } =
        useIntegrationApiV1ConnectorsList()

    const connectorList = (
        Array.isArray(responseConnectors) ? responseConnectors : []
    ).sort((a, b) => ((a.label || '') > (b.label || '') ? 1 : -1))

    const availableConnectors = connectorList?.filter(
        (f) => (f.connection_count || 0) === 0
    )
    const installedConnectors = connectorList?.filter(
        (f) =>
            (f.connection_count || 0) > 0 ||
            f.name === 'AWS' ||
            f.name === 'Azure' ||
            f.name === 'EntraID'
    )
    const totalPages = availableConnectors.length / 9
    const availableConnectorsPage = availableConnectors.slice(
        pageNo * 9,
        (pageNo + 1) * 9
    )
    return (
        <>
            {/* <TopHeader /> */}
            {/* <Grid numItems={3} className="gap-4 mb-10">
                <OnboardCard
                    title="Active Accounts"
                    active={topMetrics?.connectionsEnabled}
                    inProgress={topMetrics?.inProgressConnections}
                    healthy={topMetrics?.healthyConnections}
                    unhealthy={topMetrics?.unhealthyConnections}
                    loading={metricsLoading}
                />
            </Grid> */}
            {connectorsLoading ? (
                <Flex className="mt-36">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    {/* <TabGroup className='mt-4'>
                        <TabList>
                            <Tab>test</Tab>
                            <Tab>test</Tab>
                            <Tab>test</Tab>
                            <Tab>test</Tab>
                        </TabList>
                    </TabGroup> */}
                    <Flex
                        className="bg-white w-[90%] rounded-xl border-solid  border-2 border-gray-200   "
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <div className="border-b w-full rounded-xl border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-gray-950 sm:p-6 lg:p-8">
                            <header>
                                <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Integrations
                                </h1>
                                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                    Create and Manage your Integrations
                                </p>
                                <div className="mt-8 w-full md:flex md:max-w-3xl md:items-stretch md:space-x-4">
                                    <Card className="w-full md:w-7/12">
                                        <div className="inline-flex items-center justify-center rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border">
                                            <DocumentTextIcon
                                                className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                                                aria-hidden={true}
                                            />
                                        </div>
                                        <h3 className="mt-4 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            <a
                                                href="https://docs.opengovernance.io/"
                                                target="_blank"
                                                className="focus:outline-none"
                                            >
                                                {/* Extend link to entire card */}
                                                <span
                                                    className="absolute inset-0"
                                                    aria-hidden={true}
                                                />
                                                Documentation
                                            </a>
                                        </h3>
                                        <p className="dark:text-dark-tremor-cont text-tremor-default text-tremor-content">
                                            Learn how to add, update, remove
                                            Integrations
                                        </p>
                                    </Card>
                                </div>
                            </header>
                        </div>
                        <div className="w-full">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <main>
                                    <div className="flex items-center justify-between">
                                        {/* <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            Available Dashboards
                                        </h2> */}
                                        <div className="flex items-center space-x-2">
                                            {/* <Select
                                        placeholder="Sorty by"
                                        enableClear={false}
                                        className="[&>button]:rounded-tremor-small"
                                    >
                                        <SelectItem value="1">Name</SelectItem>
                                        <SelectItem value="2">
                                            Last edited
                                        </SelectItem>
                                        <SelectItem value="3">Size</SelectItem>
                                    </Select> */}
                                            {/* <button
                                                type="button"
                                                onClick={() => {
                                                    f()
                                                    setOpen(true)
                                                }}
                                                className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:inline-flex"
                                            >
                                                <PlusIcon
                                                    className="-ml-1 size-5 shrink-0"
                                                    aria-hidden={true}
                                                />
                                                Create new Dashboard
                                            </button> */}
                                        </div>
                                    </div>
                                    <div className="flex items-center w-full">
                                        <Grid
                                            numItemsMd={3}
                                            numItemsLg={3}
                                            className="gap-[70px] mt-6 w-full justify-items-center"
                                        >
                                            {connectorList.map(
                                                (connector, index) => {
                                                    return (
                                                        <>
                                                            {index < 12 && (
                                                                <>
                                                                    <ConnectorCard
                                                                        connector={
                                                                            connector.name
                                                                        }
                                                                        title={
                                                                            connector.label
                                                                        }
                                                                        status={
                                                                            connector.status
                                                                        }
                                                                        count={
                                                                            connector.connection_count
                                                                        }
                                                                        description={
                                                                            connector.description
                                                                        }
                                                                        tier={
                                                                            connector.tier
                                                                        }
                                                                        logo={connector.logo}
                                                                        // logo={
                                                                        //     'https://raw.githubusercontent.com/kaytu-io/website/main/connectors/icons/azure.svg'
                                                                        // }
                                                                    />
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            )}
                                        </Grid>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </Flex>
                    {/* <Title className="font-semibold">Installed</Title> */}
                    {/* <Grid
                        numItemsMd={3}
                        numItemsLg={4}
                        className="gap-[60px] mt-6"
                    >
                        {connectorList.map((connector, index) => {
                            return (
                                <>
                                    {index < 12 && (
                                        <>
                                            <ConnectorCard
                                                connector={connector.name}
                                                title={connector.label}
                                                status={connector.status}
                                                count={
                                                    connector.connection_count
                                                }
                                                description={
                                                    connector.description
                                                }
                                                tier={connector.tier}
                                                // logo={connector.logo}
                                                logo={
                                                    'https://raw.githubusercontent.com/kaytu-io/website/main/connectors/icons/azure.svg'
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )
                        })}
                    </Grid> */}
                    {/* <Title className="font-semibold mt-8">Available</Title> */}
                    {/* <Grid numItemsMd={2} numItemsLg={3} className="gap-14 mt-6">
                        {availableConnectorsPage.map((connector) => (
                            <ConnectorCard
                                connector={connector.name}
                                title={connector.label}
                                status={connector.status}
                                count={connector.connection_count}
                                description={connector.description}
                                tier={connector.tier}
                                logo={connector.logo}
                            />
                        ))}
                    </Grid> */}
                    <Flex
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="center"
                        className="mt-4 space-x-4"
                    >
                        <Text className="font-normal">
                            Page{' '}
                            <span className="font-extrabold text-black">
                                {pageNo + 1}
                            </span>{' '}
                            out of{' '}
                            <span className="font-extrabold text-black">
                                {totalPages}
                            </span>
                        </Text>
                        <Flex flexDirection="row" className="w-fit">
                            <Button
                                variant="light"
                                disabled={pageNo === 0}
                                onClick={() => setPageNo(pageNo - 1)}
                                className="px-2 py-2 !text-3xl bg-white border border-gray-300 rounded-l-full"
                            >
                                <ChevronLeftIcon className="h-4 w-6 text-black" />
                            </Button>
                            <Button
                                variant="light"
                                disabled={pageNo >= totalPages - 1}
                                onClick={() => setPageNo(pageNo + 1)}
                                className="px-2 py-2 !text-3xl bg-white border border-gray-300 rounded-r-full"
                            >
                                <ChevronRightIcon className="h-4 w-6 text-black" />
                            </Button>
                        </Flex>
                    </Flex>
                </>
            )}
        </>
    )
}
