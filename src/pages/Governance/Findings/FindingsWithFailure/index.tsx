import { Card, Flex, Text } from '@tremor/react'
import { useEffect, useMemo, useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
    IServerSideGetRowsParams,
} from 'ag-grid-community'
import { useAtomValue, useSetAtom } from 'jotai'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import FindingDetail from './Detail'
import { severityBadge, statusBadge } from '../../Controls'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import { DateRange } from '../../../../utilities/urlstate'
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

export const columns = (isDemo: boolean) => {
    const temp: IColumn<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
        any
    >[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Cloud Account',
            sortable: false,
            filter: true,
            hide: true,
            enableRowGroup: true,
            type: 'string',
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    justifyContent="start"
                    className={`h-full gap-3 group relative ${
                        isDemo ? 'blur-sm' : ''
                    }`}
                >
                    {getConnectorIcon(param.data?.connector)}
                    <Flex flexDirection="col" alignItems="start">
                        <Text className="text-gray-800">{param.value}</Text>
                        <Text>{param.data?.providerConnectionID}</Text>
                    </Flex>
                    <Card className="cursor-pointer absolute w-fit h-fit z-40 right-1 scale-0 transition-all py-1 px-4 group-hover:scale-100">
                        <Text color="blue">Open</Text>
                    </Card>
                </Flex>
            ),
        },
        {
            field: 'resourceName',
            headerName: 'Resource Name',
            hide: false,
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className={isDemo ? 'h-full' : 'h-full'}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data?.resourceTypeName}</Text>
                </Flex>
            ),
        },
        {
            field: 'resourceType',
            headerName: 'Resource Info',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text className={isDemo ? 'blur-sm' : ''}>
                        {param.data?.resourceID}
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'benchmarkID',
            headerName: 'Benchmark',
            type: 'string',
            enableRowGroup: false,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">
                        {param.data?.parentBenchmarkNames?.at(0)}
                    </Text>
                    <Text>
                        {param.data?.parentBenchmarkNames?.at(
                            (param.data?.parentBenchmarkNames?.length || 0) - 1
                        )}
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'controlID',
            headerName: 'Control',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            width: 200,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">
                        {param.data?.parentBenchmarkNames?.at(0)}
                    </Text>
                    <Text>{param.data?.controlTitle}</Text>
                </Flex>
            ),
        },
        {
            field: 'conformanceStatus',
            headerName: 'Status',
            type: 'string',
            hide: false,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            width: 100,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {statusBadge(param.value)}
                </Flex>
            ),
        },
        {
            field: 'severity',
            headerName: 'Severity',
            type: 'string',
            sortable: true,
            // rowGroup: true,
            filter: true,
            hide: false,
            resizable: true,
            width: 100,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => <Flex className="h-full">{severityBadge(param.value)}</Flex>,
        },
        {
            field: 'evaluatedAt',
            headerName: 'Last Evaluation',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (
                param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {dateTimeDisplay(param.value)}
                </Flex>
            ),
            hide: true,
        },
        {
            field: 'lastEvent',
            headerName: 'Last Event',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (
                param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiFinding>
            ) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {dateTimeDisplay(param.value)}
                </Flex>
            ),
            hide: false,
        },
    ]
    return temp
}

let sortKey = ''

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
        activeTimeRange: DateRange | undefined
        eventTimeRange: DateRange | undefined
    }
}

export default function FindingsWithFailure({ query }: ICount) {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)
    const [rows, setRows] = useState<any[]>()
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const isDemo = useAtomValue(isDemoAtom)
  const truncate = (text: string | undefined) => {
      if (text) {
          return text.length > 40 ? text.substring(0, 40) + '...' : text
      }
  }
    const GetRows = () => {
        setLoading(true)
        const api = new Api()
        api.instance = AxiosAPI
        api.compliance
            .apiV1FindingsCreate({
                filters: {
                    connector: query.connector.length ? [query.connector] : [],
                    controlID: query.controlID,
                    connectionID: query.connectionID,
                    benchmarkID: query.benchmarkID,
                    severity: query.severity,
                    resourceTypeID: query.resourceTypeID,
                    conformanceStatus: query.conformanceStatus,
                    stateActive: query.lifecycle,
                    ...(query.eventTimeRange && {
                        lastEvent: {
                            from: query.eventTimeRange.start.unix(),
                            to: query.eventTimeRange.end.unix(),
                        },
                    }),
                    ...(query.activeTimeRange && {
                        evaluatedAt: {
                            from: query.activeTimeRange.start.unix(),
                            to: query.activeTimeRange.end.unix(),
                        },
                    }),
                },
                // sort: params.request.sortModel.length
                //     ? [
                //           {
                //               [params.request.sortModel[0].colId]:
                //                   params.request.sortModel[0].sort,
                //           },
                //       ]
                //     : [],
                limit: 10,
                // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                // @ts-ignore
                afterSortKey: page == 1 ? [] : rows[rows?.length-1].sortKey
                //     params.request.startRow === 0 ||
                //     sortKey.length < 1 ||
                //     sortKey === 'none'
                //         ? []
                //         : sortKey,
            })
            .then((resp) => {
                setLoading(false)
                // @ts-ignore

                setTotalPage(Math.ceil(resp.data.totalCount / 10))
                // @ts-ignore

                setTotalCount(resp.data.totalCount)
                // @ts-ignore

                setRows(resp.data.findings)

                // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                // @ts-ignore
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
            <KTable
                className="p-3   min-h-[450px]"
                // resizableColumns
                renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                    `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                }
                onSortingChange={(event) => {
                    // setSort(event.detail.sortingColumn.sortingField)
                    // setSortOrder(!sortOrder)
                }}
                // sortingColumn={sort}
                // sortingDescending={sortOrder}
                // sortingDescending={sortOrder == 'desc' ? true : false}
                // @ts-ignore
                onRowClick={(event)=>{
                    const row = event.detail.item
                     if (
                         row.kaytuResourceID &&
                         row.kaytuResourceID.length > 0
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
                        id: 'providerConnectionName',
                        header: 'Cloud Account',
                        cell: (item) => item.providerConnectionID,
                        sortingField: 'id',
                        isRowHeader: true,
                    },
                    {
                        id: 'resourceName',
                        header: 'Resource Name',
                        cell: (item) => (
                            <>
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    justifyContent="center"
                                    className={isDemo ? 'h-full' : 'h-full'}
                                >
                                    <Text className="text-gray-800">
                                        {item.resourceName}
                                    </Text>
                                    <Text>{item.resourceTypeName}</Text>
                                </Flex>
                            </>
                        ),
                        sortingField: 'title',
                        // minWidth: 400,
                        maxWidth: 100,
                    },
                    {
                        id: 'benchmarkID',
                        header: 'Benchmark',
                        maxWidth: 100,
                        cell: (item) => (
                            <>
                                <Text className="text-gray-800">
                                    {truncate(
                                        item?.parentBenchmarkNames?.at(0)
                                    )}
                                </Text>
                                <Text>
                                    {truncate(
                                        item?.parentBenchmarkNames?.at(
                                            (item?.parentBenchmarkNames
                                                ?.length || 0) - 1
                                        )
                                    )}
                                </Text>
                            </>
                        ),
                    },
                    {
                        id: 'controlID',
                        header: 'Control',
                        maxWidth: 100,

                        cell: (item) => (
                            <>
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    justifyContent="center"
                                    className="h-full"
                                >
                                    <Text className="text-gray-800">
                                        {truncate(
                                            item?.parentBenchmarkNames?.at(0)
                                        )}
                                    </Text>
                                    <Text>{truncate(item?.controlTitle)}</Text>
                                </Flex>
                            </>
                        ),
                    },
                    {
                        id: 'conformanceStatus',
                        header: 'Status',
                        sortingField: 'severity',
                        cell: (item) => (
                            <Badge
                                // @ts-ignore
                                color={`${
                                    item.conformanceStatus == 'passed' ? 'green' : 'red'
                                }`}
                            >
                                {item.conformanceStatus}
                            </Badge>
                        ),
                        maxWidth: 100,
                    },
                    {
                        id: 'severity',
                        header: 'Severity',
                        sortingField: 'severity',
                        cell: (item) => (
                            <Badge
                                // @ts-ignore
                                color={`severity-${item.severity}`}
                            >
                                {item.severity.charAt(0).toUpperCase() +
                                    item.severity.slice(1)}
                            </Badge>
                        ),
                        maxWidth: 100,
                    },
                    {
                        id: 'evaluatedAt',
                        header: 'Last Evaluation',
                        cell: (item) => (
                            // @ts-ignore
                            <>{dateTimeDisplay(item.value)}</>
                        ),
                    },
                ]}
                columnDisplay={[
                    { id: 'resourceName', visible: true },
                    { id: 'benchmarkID', visible: true },
                    { id: 'controlID', visible: true },
                    { id: 'conformanceStatus', visible: true },
                    { id: 'severity', visible: true },
                    { id: 'evaluatedAt', visible: true },

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
                        Incidents{' '}
                        <span className=" font-medium">({totalCount})</span>
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

            <FindingDetail
                type="finding"
                finding={finding}
                open={open}
                onClose={() => setOpen(false)}
                onRefresh={() => window.location.reload()}
            />
        </>
    )
}
