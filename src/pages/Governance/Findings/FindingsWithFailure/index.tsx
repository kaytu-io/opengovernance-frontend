import { Flex, Text } from '@tremor/react'
import { useMemo, useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue, useSetAtom } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import FindingDetail from './Detail'
import { severityBadge } from '../../Controls'
import FindingFilters from './Filters'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'

export const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Cloud account',
            sortable: false,
            filter: true,
            hide: true,
            enableRowGroup: true,
            type: 'string',
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    justifyContent="start"
                    className={isDemo ? 'blur-md gap-3' : 'gap-3'}
                >
                    {getConnectorIcon(param.data.connector)}
                    <Flex flexDirection="col" alignItems="start">
                        <Text className="text-gray-800">{param.value}</Text>
                        <Text>{param.data.providerConnectionID}</Text>
                    </Flex>
                </Flex>
            ),
        },
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
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.resourceTypeName}</Text>
                </Flex>
            ),
        },
        {
            field: 'resourceType',
            headerName: 'Resource info',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.resourceID}</Text>
                </Flex>
            ),
        },
        {
            field: 'benchmarkID',
            headerName: 'Benchmark',
            type: 'string',
            enableRowGroup: false,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">
                        {param.data.parentBenchmarkNames[0]}
                    </Text>
                    <Text>
                        {
                            param.data.parentBenchmarkNames[
                                param.data.parentBenchmarkNames.length - 1
                            ]
                        }
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
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">
                        {param.data.parentBenchmarkNames[0]}
                    </Text>
                    <Text>{param.data.controlTitle}</Text>
                </Flex>
            ),
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu connection ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
        },

        {
            field: 'severity',
            headerName: 'Severity',
            type: 'string',
            sortable: true,
            // rowGroup: true,
            filter: true,
            hide: true,
            resizable: true,
            width: 100,
            cellRenderer: (param: ValueFormatterParams) => (
                <Flex className="h-full">{severityBadge(param.value)}</Flex>
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

let sortKey = ''

interface ICount {
    count: (x: number | undefined) => void
}

export default function FindingsWithFailure({ count }: ICount) {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const isDemo = useAtomValue(isDemoAtom)

    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const [connectionFilter, setConnectionFilter] = useState<string[]>([])
    const [benchmarkFilter, setBenchmarkFilter] = useState<string[]>([])
    const [resourceFilter, setResourceFilter] = useState<string[]>([])
    const [severityFilter, setSeverityFilter] = useState([
        'critical',
        'high',
        'medium',
        'low',
        'none',
    ])
    const [statusFilter, setStatusFilter] = useState(['failed'])

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                if (params.request.sortModel.length) {
                    sortKey = ''
                }
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1FindingsCreate({
                        filters: {
                            connector: providerFilter,
                            connectionID: connectionFilter,
                            benchmarkID: benchmarkFilter,
                            resourceTypeID: resourceFilter,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            severity: severityFilter,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            conformanceStatus: statusFilter,
                        },

                        sort: params.request.sortModel.length
                            ? [
                                  {
                                      [params.request.sortModel[0].colId]:
                                          params.request.sortModel[0].sort,
                                  },
                              ]
                            : [],
                        limit: 100,
                        // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        afterSortKey:
                            params.request.startRow === 0 ||
                            sortKey.length < 1 ||
                            sortKey === 'none'
                                ? []
                                : sortKey,
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.findings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        count(resp.data.totalCount || 0)
                        // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.findings[
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                resp.data.findings?.length - 1
                            ].sortKey
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(
        () => ssr(),
        [
            providerFilter,
            statusFilter,
            connectionFilter,
            benchmarkFilter,
            resourceFilter,
            severityFilter,
        ]
    )

    return (
        <Flex alignItems="start">
            <FindingFilters
                type="findings"
                providerFilter={providerFilter}
                statusFilter={statusFilter}
                connectionFilter={connectionFilter}
                benchmarkFilter={benchmarkFilter}
                resourceFilter={resourceFilter}
                severityFilter={severityFilter}
                onApply={(obj) => {
                    setProviderFilter(obj.provider)
                    setStatusFilter(obj.status)
                    setConnectionFilter(obj.connection)
                    setBenchmarkFilter(obj.benchmark)
                    setResourceFilter(obj.resource)
                    setSeverityFilter(obj.severity)
                }}
            />
            <Flex className="pl-4">
                <Table
                    fullWidth
                    id="compliance_findings"
                    columns={columns(isDemo)}
                    onCellClicked={(event: RowClickedEvent) => {
                        if (
                            event.data.kaytuResourceID &&
                            event.data.kaytuResourceID.length > 0
                        ) {
                            setFinding(event.data)
                            setOpen(true)
                        } else {
                            setNotification({
                                text: 'Detail for this finding is currently not available',
                                type: 'warning',
                            })
                        }
                    }}
                    serverSideDatasource={serverSideRows}
                    options={{
                        rowModelType: 'serverSide',
                        serverSideDatasource: serverSideRows,
                    }}
                />
                <FindingDetail
                    finding={finding}
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </Flex>
        </Flex>
    )
}
