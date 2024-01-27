import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Card, Flex, Text } from '@tremor/react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import FindingDetail from '../FindingsWithFailure/Detail'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'

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
                    className={isDemo ? 'h-full blur-md' : 'h-full'}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.kaytuResourceID}</Text>
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
                    className={isDemo ? 'h-full blur-md' : 'h-full'}
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
                        isDemo ? 'blur-md' : ''
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

let sortKey = ''

interface ICount {
    count: (x: number | undefined) => void
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
    }
}

export default function ResourcesWithFailure({ count, query }: ICount) {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const isDemo = useAtomValue(isDemoAtom)

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1ResourceFindingsCreate({
                        filters: {
                            connector: query.connector.length
                                ? [query.connector]
                                : [],
                            controlID: query.controlID,
                            connectionID: query.connectionID,
                            benchmarkID: query.benchmarkID,
                            severity: query.severity,
                            resourceTypeID: query.resourceTypeID,
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
                            rowData: resp.data.resourceFindings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        count(resp.data.totalCount || 0)
                        // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.resourceFindings[
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                resp.data.resourceFindings?.length - 1
                            ].sortKey
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(() => ssr(), [query])

    return (
        <>
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
                onSortChange={() => {
                    sortKey = ''
                }}
                serverSideDatasource={serverSideRows}
                options={{
                    rowModelType: 'serverSide',
                    serverSideDatasource: serverSideRows,
                }}
            />
            <FindingDetail
                type="resource"
                finding={finding}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
