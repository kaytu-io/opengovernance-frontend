import { useAtomValue } from 'jotai/index'
import { useNavigate } from 'react-router-dom'
import { ICellRendererParams } from 'ag-grid-community'
import { Flex } from '@tremor/react'
import { filterAtom } from '../../../../../../store'
import { useComplianceApiV1FindingsTopDetail } from '../../../../../../api/compliance.gen'
import Table, { IColumn } from '../../../../../../components/Table'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord } from '../../../../../../api/api'
import { severityBadge } from '../../../../Controls'

interface IFinder {
    id: string | undefined
}

export const policyColumns: IColumn<any, any>[] = [
    {
        headerName: 'Title',
        field: 'title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Control ID',
        field: 'id',
        width: 170,
        type: 'string',
        hide: true,
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Severity',
        field: 'severity',
        width: 120,
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: (params: ICellRendererParams) => (
            <Flex
                className="h-full w-full"
                justifyContent="center"
                alignItems="center"
            >
                {severityBadge(params.data?.severity)}
            </Flex>
        ),
    },
    // {
    //     headerName: 'Outcome',
    //     field: 'status',
    //     width: 100,
    //     type: 'string',
    //     sortable: true,
    //     filter: true,
    //     resizable: true,
    //     cellRenderer: (
    //         params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
    //     ) => {
    //         return (
    //             <Flex
    //                 className="h-full w-full"
    //                 justifyContent="center"
    //                 alignItems="center"
    //             >
    //                 {renderStatus(params.data?.passed || false)}
    //             </Flex>
    //         )
    //     },
    // },
    // {
    //     headerName: 'Failed resources %',
    //     field: 'failedResourcesCount',
    //     type: 'string',
    //     width: 150,
    //     valueFormatter: (
    //         params: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
    //     ) =>
    //         `${numberDisplay(
    //             ((params.data?.failedResourcesCount || 0) /
    //                 (params.data?.totalResourcesCount || 0)) *
    //                 100 || 0
    //         )} %`,
    //     resizable: true,
    // },
    // {
    //     headerName: 'Failed accounts %',
    //     field: 'failedConnectionCount',
    //     hide: true,
    //     type: 'string',
    //     width: 150,
    //     valueFormatter: (
    //         params: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
    //     ) =>
    //         `${numberDisplay(
    //             ((params.data?.failedConnectionCount || 0) /
    //                 (params.data?.totalConnectionCount || 0)) *
    //                 100 || 0
    //         )} %`,
    //     resizable: true,
    // },
    // {
    //     headerName: 'Last checked',
    //     field: 'evaluatedAt',
    //     type: 'date',
    //     sortable: true,
    //     hide: true,
    //     filter: true,
    //     resizable: true,
    //     valueFormatter: (param: ValueFormatterParams) => {
    //         return param.value ? dateTimeDisplay(param.value) : ''
    //     },
    // },
]

export const topControls = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiTopFieldRecord[]
        | undefined
) => {
    const data = []
    if (input) {
        for (let i = 0; i < input.length; i += 1) {
            let sev = ''
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'critical') sev = 'e'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'high') sev = 'd'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'medium') sev = 'c'
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (input[i].Control?.severity === 'low') sev = 'b'
            if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                input[i].Control?.severity === 'none' ||
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                input[i].Control?.severity === ''
            )
                sev = 'a'

            data.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...input[i].Control,
                count: input[i].count,
                totalCount: input[i].totalCount,
                resourceCount: input[i].resourceCount,
                resourceTotalCount: input[i].resourceTotalCount,
                sev,
            })
        }
    }
    return data
}

export default function Controls({ id }: IFinder) {
    const selectedConnections = useAtomValue(filterAtom)
    const navigate = useNavigate()

    const topQuery = {
        ...(id && { benchmarkId: [id] }),
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
    }
    const { response: controls, isLoading } =
        useComplianceApiV1FindingsTopDetail('controlID', 10000, topQuery)

    return (
        <Table
            id="compliance_policies"
            title="Controls"
            downloadable
            loading={isLoading}
            columns={policyColumns}
            rowData={topControls(controls?.records)}
            onRowClicked={(event) => navigate(String(event.data.id))}
        />
    )
}
