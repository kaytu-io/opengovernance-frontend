import { Card, Flex, Text, Title } from '@tremor/react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
    IServerSideGetRowsParams,
} from 'ag-grid-community'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import ResourceFindingDetail from '../ResourceFindingDetail'
import KTable from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'
import SpaceBetween from '@cloudscape-design/components/space-between'
import Badge from '@cloudscape-design/components/badge'
import {
    BreadcrumbGroup,
    Header,
    Link,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components'
import {
    AppLayout,
    SplitPanel,
} from '@cloudscape-design/components'
const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'resourceName',
            headerName: 'Resource name',
            hide: false,
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text className={isDemo ? 'blur-sm' : ''}>
                        {param.data.kaytuResourceID}
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'resourceType',
            headerName: 'Resource type',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.resourceTypeLabel}</Text>
                </Flex>
            ),
        },
        {
            field: 'resourceLocation',
            headerName: 'Resource location',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'providerConnectionName',
            headerName: 'Cloud account',
            sortable: false,
            filter: true,
            hide: false,
            enableRowGroup: true,
            type: 'string',
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    justifyContent="start"
                    className={`h-full gap-3 group relative ${
                        isDemo ? 'blur-sm' : ''
                    }`}
                >
                    {getConnectorIcon(param.data.connector)}
                    <Flex flexDirection="col" alignItems="start">
                        <Text className="text-gray-800">{param.value}</Text>
                        <Text>{param.data.providerConnectionID}</Text>
                    </Flex>
                    <Card className="cursor-pointer absolute w-fit h-fit z-40 right-1 scale-0 transition-all py-1 px-4 group-hover:scale-100">
                        <Text color="blue">Open</Text>
                    </Card>
                </Flex>
            ),
        },
        {
            field: 'totalCount',
            headerName: 'Findings',
            type: 'number',
            hide: false,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            width: 140,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">{`${param.value} issues`}</Text>
                    <Text>{`${
                        param.value - param.data.failedCount
                    } passed`}</Text>
                </Flex>
            ),
        },
        {
            field: 'evaluatedAt',
            headerName: 'Last checked',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            hide: true,
        },
    ]
    return temp
}

let sortKey: any[] = []

interface ICount {
    query: {
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
    }
}

export default function ResourcesWithFailure({ query }: ICount) {
    const setNotification = useSetAtom(notificationAtom)
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding | undefined
    >(undefined)
    const [rows, setRows] = useState<any[]>()
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const isDemo = useAtomValue(isDemoAtom)

    const GetRows = () => {
        setLoading(true)
        const api = new Api()
        api.instance = AxiosAPI
        api.compliance
            .apiV1ResourceFindingsCreate({
                filters: {
                    connector: query.connector.length ? [query.connector] : [],
                    controlID: query.controlID,
                    connectionID: query.connectionID,
                    benchmarkID: query.benchmarkID,
                    severity: query.severity,
                    resourceTypeID: query.resourceTypeID,
                    conformanceStatus: query.conformanceStatus,
                },
                // sort: [],
                limit: 100,
                // @ts-ignore
                afterSortKey: page == 1 ? [] : rows[rows?.length - 1].sortKey,

                // afterSortKey:
                //    [],
            })
            .then((resp) => {
                setLoading(false)

                setRows(resp.data.resourceFindings)
                // @ts-ignore

                setTotalPage(Math.ceil(resp.data.totalCount / 10))
                // @ts-ignore

                setTotalCount(resp.data.totalCount)
                // @ts-ignore
                // sortKey =
                //     resp.data?.resourceFindings?.at(
                //         (resp.data.resourceFindings?.length || 0) - 1
                //     )?.sortKey || []
            })
            .catch((err) => {
                setLoading(false)
                setNotification({
                    text: 'Can not Connect to Server',
                    type: 'warning',
                })
            })
    }

    useEffect(() => {
        GetRows()
    }, [page])

    return (
        <>
            <AppLayout
                toolsOpen={false}
                navigationOpen={false}
                contentType="table"
                toolsHide={true}
                navigationHide={true}
                splitPanelOpen={open}
                onSplitPanelToggle={() => {
                    setOpen(!open)
                    if (open) {
                        setFinding(undefined)
                    }
                }}
                splitPanel={
                    // @ts-ignore
                    <SplitPanel
                        // @ts-ignore
                        header={
                            finding ? (
                                <>
                                    <Flex justifyContent="start">
                                        {getConnectorIcon(finding?.connector)}
                                        <Title className="text-lg font-semibold ml-2 my-1">
                                            {finding?.resourceName}
                                        </Title>
                                    </Flex>
                                </>
                            ) : (
                                'Resource not selected'
                            )
                        }
                    >
                        <ResourceFindingDetail
                            // type="resource"
                            resourceFinding={finding}
                            open={open}
                            showOnlyOneControl={false}
                            onClose={() => setOpen(false)}
                            onRefresh={() => window.location.reload()}
                        />
                    </SplitPanel>
                }
                content={
                    <KTable
                        className="min-h-[450px]"
                        // resizableColumns
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
                            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                        }
                        variant="full-page"
                        onSortingChange={(event) => {
                            // setSort(event.detail.sortingColumn.sortingField)
                            // setSortOrder(!sortOrder)
                        }}
                        // sortingColumn={sort}
                        // sortingDescending={sortOrder}
                        // sortingDescending={sortOrder == 'desc' ? true : false}
                        // @ts-ignore
                        onRowClick={(event) => {
                            const row = event.detail.item
                            if (
                                row?.kaytuResourceID &&
                                row?.kaytuResourceID.length > 0
                            ) {
                                setFinding(row)
                                setOpen(true)
                            } else {
                                setNotification({
                                    text: 'Detail for this finding is currently not available',
                                    type: 'warning',
                                })
                            }
                        }}
                        columnDefinitions={[
                            {
                                id: 'resourceName',
                                header: 'Resource name',
                                cell: (item) => (
                                    <>
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            justifyContent="center"
                                            className="h-full"
                                        >
                                            <Text className="text-gray-800">
                                                {item.resourceName}
                                            </Text>
                                            <Text
                                                className={
                                                    isDemo ? 'blur-sm' : ''
                                                }
                                            >
                                                {item.kaytuResourceID}
                                            </Text>
                                        </Flex>
                                    </>
                                ),
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 200,
                            },
                            {
                                id: 'resourceType',
                                header: 'Resource type',
                                cell: (item) => (
                                    <>
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            justifyContent="center"
                                        >
                                            <Text className="text-gray-800">
                                                {item.resourceType}
                                            </Text>
                                            <Text>
                                                {item.resourceTypeLabel}
                                            </Text>
                                        </Flex>
                                    </>
                                ),
                                sortingField: 'title',
                                // minWidth: 400,
                                maxWidth: 200,
                            },
                            {
                                id: 'providerConnectionName',
                                header: 'Cloud account',
                                maxWidth: 100,
                                cell: (item) => (
                                    <>
                                        <Flex
                                            justifyContent="start"
                                            className={`h-full gap-3 group relative ${
                                                isDemo ? 'blur-sm' : ''
                                            }`}
                                        >
                                            {getConnectorIcon(item.connector)}
                                            <Flex
                                                flexDirection="col"
                                                alignItems="start"
                                            >
                                                <Text className="text-gray-800">
                                                    {
                                                        item.providerConnectionName
                                                    }
                                                </Text>
                                                <Text>
                                                    {item.providerConnectionID}
                                                </Text>
                                            </Flex>
                                            <Card className="cursor-pointer absolute w-fit h-fit z-40 right-1 scale-0 transition-all py-1 px-4 group-hover:scale-100">
                                                <Text color="blue">Open</Text>
                                            </Card>
                                        </Flex>
                                    </>
                                ),
                            },
                            {
                                id: 'totalCount',
                                header: 'Findings',
                                maxWidth: 100,

                                cell: (item) => (
                                    <>
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            justifyContent="center"
                                            className="h-full"
                                        >
                                            <Text className="text-gray-800">{`${item.totalCount} incidents`}</Text>
                                            <Text>{`${
                                                item.totalCount -
                                                item.failedCount
                                            } passed`}</Text>
                                        </Flex>
                                    </>
                                ),
                            },
                            // {
                            //     id: 'conformanceStatus',
                            //     header: 'Status',
                            //     sortingField: 'severity',
                            //     cell: (item) => (
                            //         <Badge
                            //             // @ts-ignore
                            //             color={`${
                            //                 item.conformanceStatus == 'passed'
                            //                     ? 'green'
                            //                     : 'red'
                            //             }`}
                            //         >
                            //             {item.conformanceStatus}
                            //         </Badge>
                            //     ),
                            //     maxWidth: 100,
                            // },
                            // {
                            //     id: 'severity',
                            //     header: 'Severity',
                            //     sortingField: 'severity',
                            //     cell: (item) => (
                            //         <Badge
                            //             // @ts-ignore
                            //             color={`severity-${item.severity}`}
                            //         >
                            //             {item.severity.charAt(0).toUpperCase() +
                            //                 item.severity.slice(1)}
                            //         </Badge>
                            //     ),
                            //     maxWidth: 100,
                            // },
                            // {
                            //     id: 'evaluatedAt',
                            //     header: 'Last Evaluation',
                            //     cell: (item) => (
                            //         // @ts-ignore
                            //         <>{dateTimeDisplay(item.value)}</>
                            //     ),
                            // },
                        ]}
                        columnDisplay={[
                            { id: 'resourceName', visible: true },
                            { id: 'resourceType', visible: true },
                            { id: 'providerConnectionName', visible: true },
                            { id: 'totalCount', visible: true },
                            // { id: 'severity', visible: true },
                            // { id: 'evaluatedAt', visible: true },

                            // { id: 'action', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={rows}
                        loading={loading}
                        loadingText="Loading resources"
                        // stickyColumns={{ first: 0, last: 1 }}
                        // stripedRows
                        trackBy="id"
                        empty={
                            <Box
                                margin={{ vertical: 'xs' }}
                                textAlign="center"
                                color="inherit"
                            >
                                <SpaceBetween size="m">
                                    <b>No resources</b>
                                </SpaceBetween>
                            </Box>
                        }
                        filter={
                            ''
                            // <PropertyFilter
                            //     // @ts-ignore
                            //     query={undefined}
                            //     // @ts-ignore
                            //     onChange={({ detail }) => {
                            //         // @ts-ignore
                            //         setQueries(detail)
                            //     }}
                            //     // countText="5 matches"
                            //     enableTokenGroups
                            //     expandToViewport
                            //     filteringAriaLabel="Control Categories"
                            //     // @ts-ignore
                            //     // filteringOptions={filters}
                            //     filteringPlaceholder="Control Categories"
                            //     // @ts-ignore
                            //     filteringOptions={undefined}
                            //     // @ts-ignore

                            //     filteringProperties={undefined}
                            //     // filteringProperties={
                            //     //     filterOption
                            //     // }
                            // />
                        }
                        header={
                            <Header className="w-full">
                                Resources{' '}
                                <span className=" font-medium">
                                    ({totalCount})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page}
                                pagesCount={totalPage}
                                onChange={({ detail }) =>
                                    setPage(detail.currentPageIndex)
                                }
                            />
                        }
                    />
                }
            />
        </>
    )
}
