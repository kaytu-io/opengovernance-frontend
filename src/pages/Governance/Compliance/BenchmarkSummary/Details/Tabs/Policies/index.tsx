import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { Badge, Flex } from '@tremor/react'
import { useComplianceApiV1BenchmarksTreeDetail } from '../../../../../../../api/compliance.gen'
import 'ag-grid-enterprise'
import Table, { IColumn } from '../../../../../../../components/Table'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'

interface IPolicies {
    id: string | undefined
}

const rows = (json: any) => {
    let arr: any = []
    let path = ''
    if (json) {
        path += `${json.title}/`
        if (json.policies !== null && json.policies !== undefined) {
            for (let i = 0; i < json.policies.length; i += 1) {
                let obj = {}
                obj = {
                    path: path + json.policies[i].title,
                    ...json.policies[i],
                }
                arr.push(obj)
            }
        }
        if (json.children !== null && json.children !== undefined) {
            for (let i = 0; i < json.children.length; i += 1) {
                const res = rows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }
    if (arr.length) {
        return arr.sort((a: any, b: any) => {
            if (a.path < b.path) {
                return -1
            }
            if (a.path > b.path) {
                return 1
            }
            return 0
        })
    }

    return arr
}

const renderBadge = (severity: any) => {
    if (severity) {
        if (severity === 'low') {
            return <Badge color="lime">Low</Badge>
        }
        if (severity === 'medium') {
            return <Badge color="yellow">Medium</Badge>
        }
        if (severity === 'high') {
            return <Badge color="orange">High</Badge>
        }
        return <Badge color="rose">Critical</Badge>
    }
    return ''
}

const renderStatus = (status: any) => {
    if (status) {
        if (status === 'passed') {
            return <Badge color="emerald">Passed</Badge>
        }
        return <Badge color="rose">Failed</Badge>
    }
    return ''
}

const columns: IColumn<any, any>[] = [
    {
        headerName: 'Title',
        field: 'title',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
    },
    {
        headerName: 'Policy ID',
        field: 'id',
        width: 170,
        type: 'string',
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
                {renderBadge(params.data?.severity)}
            </Flex>
        ),
    },
    {
        headerName: 'Status',
        field: 'status',
        width: 100,
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
                {renderStatus(params.value)}
            </Flex>
        ),
    },
    {
        headerName: '# of failed resources',
        field: 'resources',
        type: 'string',
        cellRenderer: (params: ICellRendererParams) =>
            `${params.value.passed} out of ${
                params.value.passed + params.value.failed
            }`,
        resizable: true,
    },
    {
        headerName: '# of failed accounts',
        field: 'accounts',
        type: 'string',
        cellRenderer: (params: ICellRendererParams) =>
            `${params.value.passed} out of ${
                params.value.passed + params.value.failed
            }`,
        resizable: true,
    },
    {
        headerName: 'Last checked',
        field: 'lastChecked',
        type: 'date',
        sortable: true,
        filter: true,
        resizable: true,
        valueFormatter: (param: ValueFormatterParams) => {
            return param.value ? dateTimeDisplay(param.value) : ''
        },
    },
]

// const gridOptions: GridOptions = {
// autoGroupColumnDef: {
//     headerName: 'Title',
//     flex: 2,
//     sortable: true,
//     filter: true,
//     resizable: true,
//     cellRendererParams: {
//         suppressCount: true,
//     },
// },
// treeData: true,
// getDataPath: (data: any) => {
//     return data.path.split('/')
// },
// }

export default function Policies({ id }: IPolicies) {
    const { response: policies, isLoading } =
        useComplianceApiV1BenchmarksTreeDetail(String(id))

    return (
        <Table
            title="Policies"
            downloadable
            id="compliance_policies"
            loading={isLoading}
            columns={columns}
            rowData={rows(policies)}
        />
    )
}
