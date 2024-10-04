// @ts-nocheck
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Button,
    Card,
    Color,
    Divider,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import {
    IServerSideGetRowsParams,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Radio } from 'pretty-checkbox-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Table, { IColumn } from '../../../../components/Table'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgDescribeApiJob,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import { useScheduleApiV1JobsCreate } from '../../../../api/schedule.gen'
import DrawerPanel from '../../../../components/DrawerPanel'
import KFilter from '../../../../components/Filter'
import { CloudIcon } from '@heroicons/react/24/outline'
import { string } from 'prop-types'
import KTable from '@cloudscape-design/components/table'
import Box from '@cloudscape-design/components/box'
import SpaceBetween from '@cloudscape-design/components/space-between'
import KBadge from '@cloudscape-design/components/badge'
import {
    BreadcrumbGroup,
    Header,
    Link,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components'
import {
    AppLayout,
    Container,
    ContentLayout,
    SplitPanel,
} from '@cloudscape-design/components'
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs'
const columns = () => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'id',
            headerName: 'Job ID',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: false,
            cellRenderer: (params: any) => {
                return (
                    <>{`${params.value.split('T')[0]} ${
                        params.value.split('T')[1].split('.')[0]
                    } `}</>
                )
            },
        },

        {
            field: 'type',
            headerName: 'Job Type',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderID',
            headerName: 'Account ID',
            type: 'string',
            sortable: false,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: true,
        },
        {
            field: 'connectionProviderName',
            headerName: 'Account Name',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
            suppressMenu: true,
            hide: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            type: 'string',
            sortable: false,
            filter: false,
            resizable: true,
            suppressMenu: false,
        },

        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            suppressMenu: true,
            filter: false,
            resizable: true,
            cellRenderer: (
                param: ValueFormatterParams<GithubComKaytuIoKaytuEnginePkgDescribeApiJob>
            ) => {
                let jobStatus = ''
                let jobColor: Color = 'gray'
                switch (param.data?.status) {
                    case 'CREATED':
                        jobStatus = 'created'
                        break
                    case 'QUEUED':
                        jobStatus = 'queued'
                        break
                    case 'IN_PROGRESS':
                        jobStatus = 'in progress'
                        jobColor = 'orange'
                        break
                    case 'RUNNERS_IN_PROGRESS':
                        jobStatus = 'in progress'
                        jobColor = 'orange'
                        break
                    case 'SUMMARIZER_IN_PROGRESS':
                        jobStatus = 'summarizing'
                        jobColor = 'orange'
                        break
                    case 'OLD_RESOURCE_DELETION':
                        jobStatus = 'summarizing'
                        jobColor = 'orange'
                        break
                    case 'SUCCEEDED':
                        jobStatus = 'succeeded'
                        jobColor = 'emerald'
                        break
                    case 'COMPLETED':
                        jobStatus = 'completed'
                        jobColor = 'emerald'
                        break
                    case 'FAILED':
                        jobStatus = 'failed'
                        jobColor = 'red'
                        break
                    case 'COMPLETED_WITH_FAILURE':
                        jobStatus = 'completed with failed'
                        jobColor = 'red'
                        break
                    case 'TIMEOUT':
                        jobStatus = 'time out'
                        jobColor = 'red'
                        break
                    default:
                        jobStatus = String(param.data?.status)
                }

                return <Badge color={jobColor}>{jobStatus}</Badge>
            },
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            type: 'date',
            sortable: true,
            filter: false,
            suppressMenu: true,
            resizable: true,
            hide: false,
            cellRenderer: (params: any) => {
                return (
                    <>{`${params.value.split('T')[0]} ${
                        params.value.split('T')[1].split('.')[0]
                    } `}</>
                )
            },
        },
        {
            field: 'failureReason',
            headerName: 'Failure Reason',
            type: 'string',
            sortable: false,
            suppressMenu: true,
            filter: true,
            resizable: true,
            hide: true,
        },
    ]
    return temp
}

const jobTypes = [
    {
        label: 'Discovery',
        value: 'discovery',
    },
    {
        label: 'Compliance',
        value: 'compliance',
    },
    {
        label: 'Analytics',
        value: 'analytics',
    },
]
const ShowHours = [
    {
        label: '1h',
        value: '1',
    },
    {
        label: '3h',
        value: '3',
    },
    {
        label: '6h',
        value: '6',
    },
    {
        label: '24h',
        value: '24',
    },
    // {
    //     label: 'all',
    //     value: 'all',
    // },
]
interface Option {
    label: string | undefined
    value: string | undefined
}
export default function SettingsALLJobs() {
    const findParmas = (key: string): string[] => {
        const params = searchParams.getAll(key)
        const temp = []
        if (params) {
            params.map((item, index) => {
                temp.push(item)
            })
        }
        return temp
    }
    const [open, setOpen] = useState(false)
    const [clickedJob, setClickedJob] =
        useState<GithubComKaytuIoKaytuEnginePkgDescribeApiJob>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [jobTypeFilter, setJobTypeFilter] = useState<string[] | undefined>(
        findParmas('type')
    )
    const [showHoursFilter, setShowHourFilter] = useState<number[]>(['1'])
    const [statusFilter, setStatusFilter] = useState<string[] | undefined>(
        findParmas('status')
    )
    const [allStatuses, setAllStatuses] = useState<Option[]>([])
    const [jobs, setJobs] = useState([])
    const [page, setPage] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [propertyOptions, setPropertyOptions] = useState()

    const [queries, setQueries] = useState({
        tokens: [],
        operation: 'and',
    })

    const { response } = useScheduleApiV1JobsCreate({
        hours: 24,
        pageStart: 0,
        pageEnd: 1,
    })

    useEffect(() => {
        const temp =
            response?.summaries
                ?.map((v) => {
                    return { label: v.status, value: v.status }
                })
                .filter(
                    (thing, i, arr) =>
                        arr.findIndex((t) => t.label === thing.label) === i
                ) || []
        setAllStatuses(temp)
        const temp_option = []
        temp.map((item) => {
            temp_option.push({
                propertyKey: 'job_status',
                value: item.value,
            })
        })
        jobTypes?.map((item) => {
            temp_option.push({
                propertyKey: 'job_type',
                value: item.value,
            })
        }
        )
        setPropertyOptions(temp_option)

    }, [response])
    const arrayToString = (arr: string[], title: string) => {
        let temp = ``
        arr.map((item, index) => {
            if (index == 0) {
                temp += arr[index]
            } else {
                temp += `&${title}=${arr[index]}`
            }
        })
        console.log(temp)
        return temp
    }

    useEffect(() => {
        if (
            searchParams.getAll('type') !== jobTypeFilter ||
            searchParams.get('status') !== statusFilter
        ) {
            if (jobTypeFilter?.length != 0) {
                searchParams.set('type', jobTypeFilter)
            } else {
                searchParams.delete('type')
            }
            if (statusFilter?.length != 0) {
                searchParams.set('status', statusFilter)
            } else {
                searchParams.delete('status')
            }
            window.history.pushState({}, '', `?${searchParams.toString()}`)
        }
    }, [jobTypeFilter, statusFilter])

    const GetRows = () => {
        const api = new Api()
        api.instance = AxiosAPI
        const status_filter = []
        const jobType_filter = []
        queries.tokens.map((item) => {
            if (item.propertyKey == 'job_status') {
                status_filter.push(item.value)
            } else if (item.propertyKey == 'job_type') {
                jobType_filter.push(item.value)
            }
        }
        )
        api.schedule
            .apiV1JobsCreate({
                hours: parseInt(showHoursFilter[0]) || 1,
                pageStart: page * 10,
                pageEnd: (page + 1) * 10,
                // sortBy: params.request.sortModel?.at(0)?.colId || 'updatedAt',
                // sortOrder:
                //     params.request.sortModel?.at(0)?.sort?.toUpperCase() ||
                //     'DESC',
                statusFilter: status_filter,
                typeFilters: jobType_filter,
            })
            .then((resp) => {
                if (resp.data.jobs) {
                    setJobs(resp.data.jobs)
                } else {
                    setJobs([])
                }

                setTotalCount(
                    resp.data.summaries
                        ?.map((v) => v.count)
                        ?.reduce((prev, curr) => (prev || 0) + (curr || 0), 0)
                )
                setTotalPage(
                    Math.ceil(
                        resp.data.summaries
                            ?.map((v) => v.count)
                            ?.reduce(
                                (prev, curr) => (prev || 0) + (curr || 0),
                                0
                            ) / 10
                    )
                )
                // params.success({
                //     rowData: resp.data.jobs || [],
                //     rowCount: resp.data.summaries
                //         ?.map((v) => v.count)
                //         .reduce((prev, curr) => (prev || 0) + (curr || 0), 0),
                // })
            })
            .catch((err) => {
                console.log(err)
                // params.fail()
            })
    }
    useEffect(() => {
        GetRows()
    }, [queries])

    const clickedJobDetails = [
        { title: 'ID', value: clickedJob?.id },
        { title: 'Title', value: clickedJob?.title },
        { title: 'Type', value: clickedJob?.type },
        { title: 'Created At', value: clickedJob?.createdAt },
        { title: 'Updated At', value: clickedJob?.updatedAt },
        { title: 'Kaytu Connection ID', value: clickedJob?.connectionID },
        { title: 'Account ID', value: clickedJob?.connectionProviderID },
        { title: 'Account Name', value: clickedJob?.connectionProviderName },
        { title: 'Status', value: clickedJob?.status },
        { title: 'Failure Reason', value: clickedJob?.failureReason },
    ]

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
                }}
                splitPanel={
                    <SplitPanel
                        header={
                            clickedJob ? clickedJob.title : 'Job not selected'
                        }
                    >
                        <Flex
                            flexDirection="col"
                            className="w-full"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <KeyValuePairs
                                columns={4}
                                className="w-full"
                                items={clickedJobDetails.map((item) => {
                                    return {
                                        label: item?.title,
                                        value: item?.value,
                                    }
                                })}
                            />
                        </Flex>
                    </SplitPanel>
                }
                content={
                    <KTable
                        className="  min-h-[450px]"
                        variant="full-page"
                        // resizableColumns
                        renderAriaLive={({
                            firstIndex,
                            lastIndex,
                            totalItemsCount,
                        }) =>
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
                        onRowClick={(event) => {
                            const row = event.detail.item
                            setClickedJob(row)
                            setOpen(true)
                        }}
                        columnDefinitions={[
                            {
                                id: 'id',
                                header: 'Id',
                                cell: (item) => <>{item.id}</>,
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'createdAt',
                                header: 'Created At',
                                cell: (item) => (
                                    <>{`${item?.createdAt.split('T')[0]} ${
                                        item?.createdAt
                                            .split('T')[1]
                                            .split('.')[0]
                                    } `}</>
                                ),
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'type',
                                header: 'Job Type',
                                cell: (item) => <>{item.type}</>,
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'title',
                                header: 'Title',
                                cell: (item) => <>{item.title}</>,
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'status',
                                header: 'Status',
                                cell: (item) => {
                                    let jobStatus = ''
                                    let jobColor: Color = 'gray'
                                    switch (item?.status) {
                                        case 'CREATED':
                                            jobStatus = 'created'
                                            break
                                        case 'QUEUED':
                                            jobStatus = 'queued'
                                            break
                                        case 'IN_PROGRESS':
                                            jobStatus = 'in progress'
                                            jobColor = 'orange'
                                            break
                                        case 'RUNNERS_IN_PROGRESS':
                                            jobStatus = 'in progress'
                                            jobColor = 'orange'
                                            break
                                        case 'SUMMARIZER_IN_PROGRESS':
                                            jobStatus = 'summarizing'
                                            jobColor = 'orange'
                                            break
                                        case 'OLD_RESOURCE_DELETION':
                                            jobStatus = 'summarizing'
                                            jobColor = 'orange'
                                            break
                                        case 'SUCCEEDED':
                                            jobStatus = 'succeeded'
                                            jobColor = 'emerald'
                                            break
                                        case 'COMPLETED':
                                            jobStatus = 'completed'
                                            jobColor = 'emerald'
                                            break
                                        case 'FAILED':
                                            jobStatus = 'failed'
                                            jobColor = 'red'
                                            break
                                        case 'COMPLETED_WITH_FAILURE':
                                            jobStatus = 'completed with failed'
                                            jobColor = 'red'
                                            break
                                        case 'TIMEOUT':
                                            jobStatus = 'time out'
                                            jobColor = 'red'
                                            break
                                        default:
                                            jobStatus = String(item?.status)
                                    }

                                    return (
                                        <Badge color={jobColor}>
                                            {jobStatus}
                                        </Badge>
                                    )
                                },
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                            {
                                id: 'updatedAt',
                                header: 'Updated At',
                                cell: (item) => (
                                    <>{`${item?.updatedAt.split('T')[0]} ${
                                        item?.updatedAt
                                            .split('T')[1]
                                            .split('.')[0]
                                    } `}</>
                                ),
                                sortingField: 'id',
                                isRowHeader: true,
                                maxWidth: 100,
                            },
                        ]}
                        columnDisplay={[
                            { id: 'id', visible: true },
                            { id: 'updatedAt', visible: true },
                            { id: 'title', visible: true },
                            { id: 'type', visible: true },
                            { id: 'status', visible: true },
                            { id: 'createdAt', visible: true },
                        ]}
                        enableKeyboardNavigation
                        // @ts-ignore
                        items={jobs}
                        loading={false}
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
                            <PropertyFilter
                                // @ts-ignore
                                query={queries}
                                // @ts-ignore
                                onChange={({ detail }) => {
                                    // @ts-ignore
                                    setQueries(detail)
                                }}
                                // countText="5 matches"
                                // enableTokenGroups
                                expandToViewport
                                filteringAriaLabel="Job Filters"
                                // @ts-ignore
                                // filteringOptions={filters}
                                filteringPlaceholder="Job Filters"
                                // @ts-ignore
                                filteringOptions={propertyOptions}
                                // @ts-ignore

                                filteringProperties={[
                                    {
                                        key: 'job_type',
                                        operators: ['='],
                                        propertyLabel: 'Job Type',
                                        groupValuesLabel: 'Job Type values',
                                    },
                                    {
                                        key: 'job_status',
                                        operators: [
                                            '=',
                                           
                                        ],
                                        propertyLabel: 'Job Status',
                                        groupValuesLabel: 'Job Status values',
                                    },
                                ]}
                                // filteringProperties={
                                //     filterOption
                                // }
                            />
                        }
                        header={
                            <Header className="w-full">
                                Jobs{' '}
                                <span className=" font-medium">
                                    ({totalCount})
                                </span>
                            </Header>
                        }
                        pagination={
                            <Pagination
                                currentPageIndex={page + 1}
                                pagesCount={totalPage}
                                onChange={({ detail }) =>
                                    setPage(detail.currentPageIndex - 1)
                                }
                            />
                        }
                    />
                }
            />
        </>
    )
}

{
    /**
       <Flex flexDirection="col">
                <Flex
                    flexDirection="row"
                    alignItems="start"
                    justifyContent="between"
                    className="gap-2"
                >
                    <Flex
                        flexDirection="row"
                        alignItems="start"
                        justifyContent="start"
                        className="gap-2"
                    >
                        <KFilter
                            options={jobTypes}
                            type="multi"
                            hasCondition={true}
                            condition={jobTypeContains}
                            selectedItems={jobTypeFilter}
                            onChange={(values: string[]) => {
                                console.log(values, 'values')
                                console.log(jobTypeFilter, 'filter')

                                setJobTypeFilter(values)
                            }}
                            label="Job Types"
                            icon={CloudIcon}
                        />
                        <KFilter
                            options={allStatuses}
                            type="multi"
                            selectedItems={statusFilter}
                            condition={jobStatusContains}
                            hasCondition={true}
                            onChange={(values: string[]) => {
                                setStatusFilter(values)
                            }}
                            label="Job Status"
                            icon={CloudIcon}
                        />
                        <KFilter
                            options={ShowHours}
                            type="multi"
                            hasCondition={false}
                            selectedItems={showHoursFilter}
                            onChange={(values: string[]) => {
                                if (values.length == 0) {
                                    setShowHourFilter([])
                                } else {
                                    setShowHourFilter([values.pop()])
                                }
                            }}
                            label="Show jobs in"
                            icon={CloudIcon}
                        />
                    </Flex>

                    <Button
                        onClick={() => {
                            // @ts-ignore
                            ssr()
                        }}
                        disabled={false}
                        loading={false}
                        loadingText="Running"
                    >
                        Refresh
                    </Button>
                </Flex>
                <Card className="mt-4">
                    <Title className="font-semibold mb-5">Jobs</Title>

                    <Flex alignItems="start">
                        {/* <Card className="sticky top-6 min-w-[200px] max-w-[200px]">
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Job Type
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                {jobTypes.map((jobType) => (
                                    <Radio
                                        name="jobType"
                                        onClick={() =>
                                            setJobTypeFilter(jobType.value)
                                        }
                                        checked={
                                            jobTypeFilter === jobType.value
                                        }
                                    >
                                        {jobType.label}
                                    </Radio>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Status
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
                                    onClick={() => setStatusFilter('')}
                                    checked={statusFilter === ''}
                                >
                                    All
                                </Radio>
                                {allStatuses.map((status) => (
                                    <Radio
                                        name="status"
                                        onClick={() => setStatusFilter(status)}
                                        checked={statusFilter === status}
                                    >
                                        {status}
                                    </Radio>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                </Card> 
                        <Flex className="pl-4">
                            <Table
                                id="jobs"
                                columns={columns()}
                                serverSideDatasource={serverSideRows}
                                onCellClicked={(event) => {
                                    setClickedJob(event.data)
                                    setOpen(true)
                                }}
                                options={{
                                    rowModelType: 'serverSide',
                                    serverSideDatasource: serverSideRows,
                                }}
                            />
                        </Flex>
                    </Flex>
                    <DrawerPanel
                        open={open}
                        onClose={() => setOpen(false)}
                        title="Job Details"
                    >
                        <Flex flexDirection="col">
                            {clickedJobDetails.map((item) => {
                                return (
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="between"
                                        alignItems="start"
                                        className="mt-2"
                                    >
                                        <Text className="w-56 font-bold">
                                            {item.title}
                                        </Text>
                                        <Text className="w-full">
                                            {item.value}
                                        </Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </DrawerPanel>
                </Card>
            </Flex>
    */
}
