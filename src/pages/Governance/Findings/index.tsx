import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Card,
    Divider,
    Flex,
    Text,
    TextInput,
} from '@tremor/react'
import { useEffect, useMemo, useState } from 'react'
import {
    IServerSideDatasource,
    RowClickedEvent,
    SortModelItem,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Checkbox, Radio, useCheckboxState } from 'pretty-checkbox-react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import { isDemoAtom } from '../../../store'
import Table, { IColumn } from '../../../components/Table'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import {
    useComplianceApiV1BenchmarksSummaryList,
    useComplianceApiV1FindingsCreate,
    useComplianceApiV1FindingsFiltersCreate,
} from '../../../api/compliance.gen'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import Spinner from '../../../components/Spinner'
import { benchmarkList } from '../Compliance'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
} from '../../../api/api'
import FindingDetail from './Detail'

export const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            width: 120,
            field: 'connector',
            headerName: 'Cloud Provider',
            sortable: true,
            filter: true,
            hide: true,
            enableRowGroup: true,
            type: 'string',
        },
        {
            field: 'policyID',
            headerName: 'Policy ID',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            hide: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'benchmarkID',
            headerName: 'Benchmark ID',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'policyTitle',
            headerName: 'Policy title',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'providerConnectionName',
            headerName: 'Cloud provider name',
            type: 'string',
            enableRowGroup: true,
            hide: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'Cloud provider ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu connection ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'resourceType',
            headerName: 'Resource type',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'resourceName',
            headerName: 'Resource name',
            hide: true,
            type: 'string',
            enableRowGroup: true,
            sortable: true,
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
            flex: 0.5,
        },
        {
            field: 'evaluatedAt',
            headerName: 'Last checked',
            type: 'datetime',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
        },
    ]
    return temp
}

const severity = ['Critical', 'High', 'Medium', 'Low', 'None', 'Passed']

const datasource = (
    sort: SortModelItem[],
    recall: any,
    result:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse
        | undefined,
    loading: boolean,
    err: boolean,
    handleParam: any
) => {
    return {
        getRows: (params: IServerSideGetRowsParams) => {
            handleParam(params)
            if (params.request.sortModel.length > 0) {
                if (sort.length > 0) {
                    if (
                        params.request.sortModel[0].colId !== sort[0].colId ||
                        params.request.sortModel[0].sort !== sort[0].sort
                    ) {
                        recall([params.request.sortModel[0]])
                    }
                } else {
                    recall([params.request.sortModel[0]])
                }
            } else if (sort.length > 0) {
                recall([])
            }
            if (!loading && result) {
                params.success({
                    rowData: result?.findings || [],
                    rowCount: result?.totalCount || 0,
                })
            }
            if (err) {
                params.fail()
            }
        },
    }
}

const filteredConnectionsList = (
    connection:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
        | undefined,
    filter: string
) => {
    const result = connection?.filter(
        (c) =>
            c?.providerConnectionName
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
            c?.providerConnectionID
                ?.toLowerCase()
                .includes(filter.toLowerCase())
    )
    const count = result?.length || 0
    return {
        result,
        count,
    }
}

export default function Findings() {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)
    const [sortModel, setSortModel] = useState<SortModelItem[]>([])
    const [provider, setProvider] = useState('')
    const [connectionSearch, setConnectionSearch] = useState('')
    const [resourceSearch, setResourceSearch] = useState('')
    const [status, setStatus] = useState<'compliant' | 'non-compliant' | 'any'>(
        'non-compliant'
    )
    const [sortKey, setSortKey] = useState('')
    const [tableParam, setTableParam] = useState<IServerSideGetRowsParams>()
    const [lastPage, setLastPage] = useState(100)

    const connectionCheckbox = useCheckboxState({ state: [] })
    const benchmarkCheckbox = useCheckboxState({ state: [] })
    const resourceCheckbox = useCheckboxState({ state: [] })
    const severityCheckbox = useCheckboxState({
        state: ['critical', 'high', 'medium', 'low', 'none'],
    })

    useEffect(() => {
        switch (status) {
            case 'non-compliant':
                severityCheckbox.setState([
                    'critical',
                    'high',
                    'medium',
                    'low',
                    'none',
                ])
                break
            case 'compliant':
                severityCheckbox.setState(['passed'])
                break
            default:
                break
        }
    }, [status])

    const isDemo = useAtomValue(isDemoAtom)

    const {
        response: findings,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1FindingsCreate({
        filters: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: connectionCheckbox.state,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            benchmarkID: benchmarkCheckbox.state,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resourceTypeID: resourceCheckbox.state,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            severity: severityCheckbox.state,
            activeOnly: true,
        },
        sort: sortModel.length
            ? { [sortModel[0].colId]: sortModel[0].sort }
            : {},
        limit: 100,
        afterSortKey: [sortKey],
    })
    console.log(findings)

    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            pageNumber: 1,
            pageSize: 2000,
            needCost: false,
            needResourceCount: false,
        })
    const { response: benchmarks, isLoading: benchmarksLoading } =
        useComplianceApiV1BenchmarksSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: connectionCheckbox.state,
        })
    const { response: filters, isLoading: filtersLoading } =
        useComplianceApiV1FindingsFiltersCreate({})

    const getData = (sort: SortModelItem[]) => {
        setSortModel(sort)
        sendNow()
    }

    const handleParam = (param: IServerSideGetRowsParams) => {
        setTableParam(param)
    }

    useEffect(() => {
        if (tableParam?.request.startRow === lastPage) {
            const list = findings?.findings
            if (list) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line no-unsafe-optional-chaining
                setSortKey(list[list?.length - 1].sortKey[0] || '')
            }
            sendNow()
        }
    }, [tableParam])

    const ds: IServerSideDatasource = useMemo(
        () =>
            datasource(
                sortModel,
                getData,
                findings,
                isLoading,
                error,
                handleParam
            ),
        [findings, sortModel]
    )

    return (
        <Layout currentPage="findings">
            <Header />
            <Flex alignItems="start">
                <Card className="sticky w-fit">
                    <Accordion
                        defaultOpen
                        className="w-56 border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Cloud provider
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('')}
                                    defaultChecked={provider === ''}
                                >
                                    All
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('AWS')}
                                    defaultChecked={provider === 'AWS'}
                                >
                                    AWS
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('Azure')}
                                    defaultChecked={provider === 'Azure'}
                                >
                                    Azure
                                </Radio>
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="w-56 border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Finding status
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                <Radio
                                    name="status"
                                    onClick={() => setStatus('compliant')}
                                    defaultChecked={status === 'compliant'}
                                >
                                    Compliant
                                </Radio>
                                <Radio
                                    name="status"
                                    onClick={() => setStatus('non-compliant')}
                                    defaultChecked={status === 'non-compliant'}
                                >
                                    Non-compliant
                                </Radio>
                                <Radio
                                    name="status"
                                    onClick={() => setStatus('any')}
                                    defaultChecked={status === 'any'}
                                >
                                    Any
                                </Radio>
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="w-56 border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Severity
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                {severity.map((s) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        shape="curve"
                                        className="!items-start"
                                        value={s.toLowerCase()}
                                        {...severityCheckbox}
                                    >
                                        {s}
                                    </Checkbox>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Cloud accounts
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search cloud accounts..."
                                value={connectionSearch}
                                onChange={(e) =>
                                    setConnectionSearch(e.target.value)
                                }
                                className="mb-4"
                            />
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="px-0.5 gap-2.5 overflow-y-scroll overflow-x-hidden"
                            >
                                {connectionsLoading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        {filteredConnectionsList(
                                            connections?.connections,
                                            connectionSearch
                                        ).result?.map(
                                            (con, i) =>
                                                i < 5 && (
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    <Checkbox
                                                        shape="curve"
                                                        className="!items-start"
                                                        value={con.id}
                                                        {...connectionCheckbox}
                                                    >
                                                        <Flex
                                                            flexDirection="col"
                                                            alignItems="start"
                                                            className="-mt-0.5"
                                                        >
                                                            <Text className="text-gray-800 truncate">
                                                                {
                                                                    con.providerConnectionName
                                                                }
                                                            </Text>
                                                            <Text className="text-xs truncate">
                                                                {
                                                                    con.providerConnectionID
                                                                }
                                                            </Text>
                                                        </Flex>
                                                    </Checkbox>
                                                )
                                        )}
                                        <Flex justifyContent="end">
                                            <Text>
                                                {filteredConnectionsList(
                                                    connections?.connections,
                                                    connectionSearch
                                                ).count > 5
                                                    ? `+ ${
                                                          filteredConnectionsList(
                                                              connections?.connections,
                                                              connectionSearch
                                                          ).count - 5
                                                      } more`
                                                    : ''}
                                            </Text>
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800 font-semibold">
                                Benchmarks
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            {benchmarksLoading ? (
                                <Spinner />
                            ) : (
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="px-0.5 gap-2.5"
                                >
                                    {benchmarkList(
                                        benchmarks?.benchmarkSummary
                                    ).connected?.map((ben) => (
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        <Checkbox
                                            shape="curve"
                                            className="!items-start"
                                            value={ben.id}
                                            {...benchmarkCheckbox}
                                        >
                                            {ben.title}
                                        </Checkbox>
                                    ))}
                                </Flex>
                            )}
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800 font-semibold">
                                Resource types
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search resource types..."
                                value={resourceSearch}
                                onChange={(e) =>
                                    setResourceSearch(e.target.value)
                                }
                                className="mb-4"
                            />
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="px-0.5 gap-2.5 overflow-y-scroll overflow-x-hidden"
                            >
                                {filtersLoading ? (
                                    <Spinner />
                                ) : (
                                    filters?.resourceTypeID
                                        ?.filter((p) =>
                                            p
                                                ?.toLowerCase()
                                                .includes(
                                                    resourceSearch.toLowerCase()
                                                )
                                        )
                                        .map(
                                            (p, i) =>
                                                i < 5 && (
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    <Checkbox
                                                        shape="curve"
                                                        className="!items-start"
                                                        value={p}
                                                        {...resourceCheckbox}
                                                    >
                                                        {p}
                                                    </Checkbox>
                                                )
                                        )
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                </Card>
                <Flex className="w-full pl-6">
                    <Table
                        fullWidth
                        id="compliance_findings"
                        columns={columns(isDemo)}
                        onCellClicked={(event: RowClickedEvent) => {
                            setFinding(event.data)
                            setOpen(true)
                        }}
                        onGridReady={(e) => {
                            if (isLoading) {
                                e.api.showLoadingOverlay()
                            }
                        }}
                        serverSideDatasource={ds}
                        loading={isLoading}
                        options={{ rowModelType: 'serverSide' }}
                    />
                    <FindingDetail
                        finding={finding}
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                </Flex>
            </Flex>
        </Layout>
    )
}
