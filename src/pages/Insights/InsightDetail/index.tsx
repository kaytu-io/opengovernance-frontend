import {
    BadgeDelta,
    Button,
    Callout,
    Card,
    Flex,
    Select,
    SelectItem,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai/index'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GridOptions } from 'ag-grid-community'
import 'ag-grid-enterprise'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import LoggedInLayout from '../../../components/LoggedInLayout'
import {
    useComplianceApiV1InsightDetail,
    useComplianceApiV1InsightTrendDetail,
} from '../../../api/compliance.gen'
import { timeAtom } from '../../../store'
import Downloader from './Downloader'
import { numberGroupedDisplay } from '../../../utilities/numericDisplay'
import Breadcrumbs from '../../../components/Breadcrumbs'
import DateRangePicker from '../../../components/DateRangePicker'
import Spinner from '../../../components/Spinner'
import InsightTablePanel from './InsightTablePanel'
import { snakeCaseToLabel } from '../../../utilities/labelMaker'
import Chart from '../../../components/Charts'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../utilities/deltaType'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiInsight } from '../../../api/api'
import { AWSIcon, AzureIcon } from '../../../icons/icons'
import { dateDisplay } from '../../../utilities/dateDisplay'

const chartData = (inputData: any) => {
    const data = []
    if (inputData) {
        for (let i = 0; i < inputData.length; i += 1) {
            data.push({
                count: inputData[i].value,
                date: dayjs
                    .unix(inputData[i].timestamp)
                    .format('MMM DD, YYYY - HH:mm'),
            })
        }
    }
    return data
}

const generateType = (input: any) => {
    if (Number(Date.parse(input))) return 'date'
    if (Number(input)) return 'number'
    return 'string'
}

const insightsHeadersToColumns = (headers: any) => {
    if (headers && headers.length) {
        return headers.map((header: any) => ({
            field: header,
            headerName: snakeCaseToLabel(header),
            sortable: true,
            resizable: true,
            filter: true,
            flex: 1,
        }))
    }
    return []
}

const insightsResultToRows = (details: any) => {
    if (!details) {
        return []
    }
    const { rows, headers } = details
    return (
        rows?.map((array: any, i: any) => {
            const object = Object.fromEntries(
                headers.map((key: any, index: any) => [
                    key,
                    typeof array[index] === 'string'
                        ? array[index]
                        : JSON.stringify(array[index]),
                ])
            )
            return { id: i, ...object }
        }) || []
    )
}

const gridOptions: GridOptions = {
    pagination: true,
    animateRows: true,
    paginationPageSize: 25,
    getRowHeight: (params: any) => 50,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            },
            {
                id: 'uniqueCount',
                labelDefault: 'Unique Counts',
                labelKey: 'uniqueCount',
                toolPanel: InsightTablePanel,
            },
        ],
        defaultToolPanel: '',
    },
}

const generateBadge = (
    met: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight | undefined
) => {
    if (!met?.totalResultValue && !met?.oldTotalResultValue) {
        return (
            <Callout
                title="Time period is not covered by insight"
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    if (!met?.totalResultValue) {
        return (
            <Callout
                title="End value is not available"
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    if (!met?.oldTotalResultValue) {
        return (
            <Callout
                title={`Data is available after ${dateDisplay(
                    met.firstOldResultDate
                )}`}
                color="rose"
                icon={ExclamationCircleIcon}
                className="ml-3 border-0 text-xs leading-5 w-96 drop-shadow-sm"
            />
        )
    }
    return (
        <BadgeDelta
            deltaType={badgeTypeByDelta(
                met.oldTotalResultValue,
                met.totalResultValue
            )}
            className="cursor-pointer my-2"
        >
            {`${percentageByChange(
                met.oldTotalResultValue,
                met.totalResultValue
            )}%`}
        </BadgeDelta>
    )
}

export default function InsightDetail() {
    const gridRef = useRef<AgGridReact>(null)
    const navigate = useNavigate()
    const { id } = useParams()
    const activeTimeRange = useAtomValue(timeAtom)

    const [detailsDate, setDetailsDate] = useState<string>('')

    const start = () => {
        if (detailsDate === '') {
            return activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) - 1)
        return dayjs(d)
    }
    const end = () => {
        if (detailsDate === '') {
            return activeTimeRange.end || activeTimeRange.start
        }
        const d = new Date(0)
        d.setUTCSeconds(parseInt(detailsDate, 10) + 1)
        return dayjs(d)
    }
    const query = {
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end
            ? {
                  endTime: activeTimeRange.end.unix(),
              }
            : {
                  endTime: activeTimeRange.start.unix(),
              }),
    }
    const { response: insightTrend, isLoading: trendLoading } =
        useComplianceApiV1InsightTrendDetail(String(id), query)

    const detailsQuery = {
        ...(activeTimeRange.start && {
            startTime: start().unix(),
            endTime: end().unix(),
        }),
    }
    const { response: insightDetail, isLoading: detailLoading } =
        useComplianceApiV1InsightDetail(String(id), detailsQuery)

    const columns =
        insightDetail?.result && insightDetail?.result[0]?.details
            ? insightDetail?.result[0].details.headers
            : []

    const rows = insightDetail?.result
        ? insightDetail?.result[0].details
        : undefined

    const breadcrumbsPages = [
        {
            name: 'Insights',
            path: () => {
                navigate('./..')
            },
            current: false,
        },
        { name: 'Insight Detail', path: '', current: true },
    ]

    const trendDates = () => {
        return (
            insightTrend?.map((item) => {
                const dt = item.timestamp || 0
                const d = new Date(0)
                d.setUTCSeconds(dt)
                return (
                    <SelectItem value={dt.toString()}>
                        {d.toLocaleString()}
                    </SelectItem>
                )
            }) || []
        )
    }

    useEffect(() => {
        if (detailLoading) {
            gridRef.current?.api.showLoadingOverlay()
        }
    }, [detailLoading])

    return (
        <LoggedInLayout currentPage="insight">
            {trendLoading || detailLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <Flex flexDirection="col">
                    <Flex
                        flexDirection="row"
                        justifyContent="between"
                        alignItems="center"
                        className="mb-6"
                    >
                        <Breadcrumbs pages={breadcrumbsPages} />
                        <DateRangePicker />
                    </Flex>
                    <Flex flexDirection="col">
                        <Flex flexDirection="row">
                            {detailLoading ? (
                                <Spinner className="my-6" />
                            ) : (
                                <Flex
                                    flexDirection="row"
                                    justifyContent="between"
                                    alignItems="start"
                                    className="mb-4"
                                >
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="start"
                                    >
                                        {insightDetail?.connector === 'AWS' ? (
                                            <AWSIcon />
                                        ) : (
                                            <AzureIcon />
                                        )}
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className="ml-3"
                                        >
                                            <Title className="font-semibold whitespace-nowrap">
                                                {insightDetail?.shortTitle}
                                            </Title>
                                            <Text>
                                                {insightDetail?.description}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex flexDirection="row">
                                        <Flex
                                            flexDirection="row"
                                            alignItems="end"
                                            justifyContent="end"
                                            className="m-3"
                                        >
                                            {!!insightDetail?.totalResultValue && (
                                                <Title className="font-semibold mr-1">
                                                    {numberGroupedDisplay(
                                                        insightDetail?.totalResultValue ||
                                                            0
                                                    )}
                                                </Title>
                                            )}
                                            {!!insightDetail?.oldTotalResultValue && (
                                                <Subtitle className="text-sm mb-0.5">
                                                    {`from ${numberGroupedDisplay(
                                                        insightDetail?.oldTotalResultValue ||
                                                            0
                                                    )}`}
                                                </Subtitle>
                                            )}
                                        </Flex>
                                        {generateBadge(insightDetail)}
                                    </Flex>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    <Card>
                        <Title className="font-semibold">Insight count</Title>
                        <Chart
                            className="mt-4 h-80"
                            index="date"
                            type="line"
                            yAxisWidth={60}
                            categories={['count']}
                            data={chartData(insightTrend)}
                            // curveType="natural"
                        />
                    </Card>
                    <Flex flexDirection="row" className="mt-6">
                        <Title className="font-semibold">Results</Title>
                        <Flex className="w-1/3">
                            <Select
                                className="mr-4"
                                onValueChange={setDetailsDate}
                                placeholder={
                                    detailsDate === ''
                                        ? 'Latest'
                                        : end().format('MMM DD, YYYY')
                                }
                            >
                                <>{trendDates()}</>
                            </Select>
                            <Downloader
                                Headers={columns}
                                Rows={rows?.rows ? rows.rows : []}
                                Name={insightDetail?.shortTitle}
                            />
                        </Flex>
                    </Flex>
                    {detailsDate !== '' && (
                        <Flex
                            flexDirection="row"
                            className="bg-blue-50 mt-2 rounded-md pr-6"
                        >
                            <Callout
                                title={`The available data for the result is exclusively limited to ${end().format(
                                    'MMM DD, YYYY'
                                )}.`}
                                color="blue"
                                icon={ExclamationCircleIcon}
                                className="w-full text-xs leading-5 truncate max-w-full"
                            >
                                <Flex flexDirection="row">
                                    <Text className="text-blue-800">
                                        The following results present you with a
                                        partial result based on the filter you
                                        have selected.
                                    </Text>
                                </Flex>
                            </Callout>
                            <Button
                                variant="secondary"
                                onClick={() => setDetailsDate('')}
                            >
                                Show All
                            </Button>
                        </Flex>
                    )}

                    <div className="w-full mt-3 ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            domLayout="autoHeight"
                            gridOptions={gridOptions}
                            columnDefs={insightsHeadersToColumns(columns)}
                            rowData={insightsResultToRows(rows)}
                        />
                    </div>
                </Flex>
            )}
        </LoggedInLayout>
    )
}
