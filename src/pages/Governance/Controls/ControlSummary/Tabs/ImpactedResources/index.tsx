import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Flex, Text } from '@tremor/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Table, { IColumn } from '../../../../../../components/Table'
import FindingDetail from '../../../../Findings/FindingsWithFailure/Detail'
import { isDemoAtom, notificationAtom } from '../../../../../../store'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
} from '../../../../../../api/api'
import AxiosAPI from '../../../../../../api/ApiConfig'
import { activeBadge, statusBadge } from '../../../index'
import { dateTimeDisplay } from '../../../../../../utilities/dateDisplay'
import { getConnectorIcon } from '../../../../../../components/Cards/ConnectorCard'
import ResourceFindingDetail from '../../../../Findings/ResourceFindingDetail'

let sortKey: any[] = []

interface IImpactedResources {
    controlId: string
    onlyFailed?: boolean
    linkPrefix?: string
}

const columns = (controlID: string, isDemo: boolean) => {
    const temp: IColumn<
        GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
        any
    >[] = [
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
            cellRenderer: (
                param: ICellRendererParams<
                    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
                    any
                >
            ) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">
                        {param.data?.resourceName || 'Resource deleted'}
                    </Text>
                    <Text className={isDemo ? 'blur-sm' : ''}>
                        {param.data?.kaytuResourceID}
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
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (
                param: ICellRendererParams<
                    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
                    any
                >
            ) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">
                        {param.data?.resourceTypeLabel}
                    </Text>
                    <Text>{param.data?.resourceType}</Text>
                </Flex>
            ),
        },
        // {
        //     field: 'benchmarkID',
        //     headerName: 'Benchmark',
        //     type: 'string',
        //     enableRowGroup: true,
        //     sortable: false,
        //     hide: true,
        //     filter: true,
        //     resizable: true,
        //     flex: 1,
        //     cellRenderer: (param: ICellRendererParams) => (
        //         <Flex flexDirection="col" alignItems="start">
        //             <Text className="text-gray-800">
        //                 {param.data.parentBenchmarkNames[0]}
        //             </Text>
        //             <Text>{param.value}</Text>
        //         </Flex>
        //     ),
        // },
        {
            field: 'providerConnectionName',
            headerName: 'Account',
            type: 'string',
            enableRowGroup: true,
            hide: false,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (
                param: ICellRendererParams<
                    GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
                    any
                >
            ) => (
                <Flex flexDirection="row" justifyContent="start">
                    {getConnectorIcon(param.data?.connector, '-ml-2 mr-2')}
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className={isDemo ? 'blur-sm' : ''}
                    >
                        <Text className="text-gray-800">
                            {param.data?.providerConnectionName}
                        </Text>
                        <Text>{param.data?.providerConnectionID}</Text>
                    </Flex>
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
        // {
        //     field: 'stateActive',
        //     headerName: 'State',
        //     type: 'string',
        //     sortable: true,
        //     filter: true,
        //     hide: false,
        //     resizable: true,
        //     flex: 1,
        //     cellRenderer: (param: ValueFormatterParams) => (
        //         <Flex className="h-full">{activeBadge(param.value)}</Flex>
        //     ),
        // },
        {
            field: 'failedCount',
            headerName: 'Conformance status',
            type: 'string',
            sortable: true,
            filter: true,
            hide: false,
            resizable: true,
            width: 160,
            cellRenderer: (
                param: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding>
            ) => (
                <Flex className="h-full">
                    {statusBadge(
                        param.data?.findings
                            ?.filter((f) => f.controlID === controlID)
                            .map((f) => f.conformanceStatus)
                            .at(0)
                    )}
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
            width: 200,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            hide: false,
        },
    ]
    return temp
}

export default function ImpactedResources({
    controlId,
    onlyFailed,
    linkPrefix,
}: IImpactedResources) {
    const isDemo = useAtomValue(isDemoAtom)
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding | undefined
    >(undefined)
    const [error, setError] = useState('')

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1ResourceFindingsCreate({
                        filters: {
                            controlID: [controlId || ''],
                            conformanceStatus:
                                onlyFailed === true
                                    ? [
                                          GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
                                      ]
                                    : [
                                          GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusPassed,
                                          GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
                                      ],
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
                        afterSortKey:
                            params.request.startRow === 0 || sortKey.length < 1
                                ? []
                                : sortKey,
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.resourceFindings || [],
                            rowCount: resp.data.totalCount || 0,
                        })

                        sortKey =
                            resp.data.resourceFindings?.at(
                                (resp.data.resourceFindings?.length || 0) - 1
                            )?.sortKey || []
                    })
                    .catch((err) => {
                        if (
                            err.message !==
                            "Cannot read properties of null (reading 'NaN')"
                        ) {
                            setError(err.message)
                        }
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(() => ssr(), [onlyFailed])

    return (
        <>
            {error.length > 0 && (
                <Flex className="w-fit mb-3 gap-1">
                    <ExclamationCircleIcon className="text-rose-600 h-5" />
                    <Text color="rose">{error}</Text>
                </Flex>
            )}
            <Table
                fullWidth
                id="compliance_findings"
                columns={columns(controlId, isDemo)}
                onCellClicked={(
                    event: RowClickedEvent<
                        GithubComKaytuIoKaytuEnginePkgComplianceApiResourceFinding,
                        any
                    >
                ) => {
                    if (
                        event.data?.kaytuResourceID &&
                        event.data?.kaytuResourceID.length > 0
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
                onSortChange={() => {
                    sortKey = []
                }}
                options={{
                    rowModelType: 'serverSide',
                    serverSideDatasource: serverSideRows,
                }}
            />
            <ResourceFindingDetail
                resourceFinding={finding}
                controlID={controlId}
                showOnlyOneControl
                open={open}
                onClose={() => setOpen(false)}
                onRefresh={() => window.location.reload()}
                linkPrefix={linkPrefix}
            />
        </>
    )
}
