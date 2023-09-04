import {
    Button,
    Card,
    Flex,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useLocation } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-enterprise'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import {
    ColDef,
    GetContextMenuItemsParams,
    GridOptions,
    MenuItemDef,
    ValueFormatterParams,
} from 'ag-grid-community'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/outline'
import Menu from '../../../components/Menu'
import { useInventoryApiV2AnalyticsSpendTableList } from '../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import {
    checkGranularity,
    generateItems,
} from '../../../utilities/dateComparator'
import Header from '../../../components/Header'
import { capitalizeFirstLetter } from '../../../utilities/labelMaker'

export default function CostMetricsDetails() {
    const { hash } = useLocation()
    const page = () => {
        switch (hash) {
            case '#connections':
                return 'connection'
            case '#services':
                return 'metric'
            default:
                return 'category'
        }
    }

    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [dimension, setDimension] = useState<string>(page())
    const dimensionName = () => {
        switch (dimension) {
            case 'connection':
                return 'Connection Name'
            default:
                return 'Service Name'
        }
    }
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    const query = (): {
        startTime?: number | undefined
        endTime?: number | undefined
        granularity?: 'daily' | 'monthly' | 'yearly' | undefined
        dimension?: 'metric' | 'connection' | undefined
        connectionId?: string[]
        metricIds?: string[]
    } => {
        let dim: 'metric' | 'connection' = 'metric'
        if (dimension === 'connection') {
            dim = 'connection'
        }

        let gra: 'monthly' | 'daily' = 'daily'
        if (selectedGranularity === 'monthly') {
            gra = 'monthly'
        }

        return {
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            dimension: dim,
            granularity: gra,
            connectionId: selectedConnections.connections,
        }
    }
    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList(
        query()
    )

    const gridRef = useRef<AgGridReact>(null)

    function getContextMenuItems(
        params: GetContextMenuItemsParams
    ): (string | MenuItemDef)[] {
        const result: (string | MenuItemDef)[] = [
            'copy',
            'separator',
            'chartRange',
        ]
        return result
    }

    const filterPanel = () => {
        return (
            <Flex
                flexDirection="col"
                justifyContent="start"
                alignItems="start"
                className="w-full px-6"
            >
                <Text className="m-3">Granularity</Text>
                <Select
                    value={selectedGranularity}
                    onValueChange={(v) =>
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        setSelectedGranularity(v)
                    }
                    placeholder={capitalizeFirstLetter(selectedGranularity)}
                >
                    {generateItems(activeTimeRange.start, activeTimeRange.end)}
                </Select>
                <Text className="m-3">Show by</Text>
                <Select
                    value={dimension}
                    onValueChange={(v) => setDimension(v)}
                >
                    <SelectItem value="metric">Service</SelectItem>
                    <SelectItem value="connection">Connection</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                </Select>
            </Flex>
        )
    }

    useEffect(() => {
        gridRef.current?.api?.setSideBar({
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
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        })
    }, [selectedGranularity, dimension])

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 25,
        suppressExcelExport: true,
        animateRows: true,
        enableGroupEdit: true,
        columnTypes: {
            dimension: {
                enableRowGroup: true,
                enablePivot: true,
            },
        },
        rowGroupPanelShow: 'always',
        groupAllowUnbalanced: true,
        autoGroupColumnDef: {
            pinned: true,
            flex: 2,
            sortable: true,
            filter: true,
            resizable: true,
        },
        getRowHeight: () => 50,
        onGridReady: (e) => {
            if (isLoading) {
                e.api.showLoadingOverlay()
            }
        },
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
                    minWidth: 300,
                    maxWidth: 300,
                    width: 300,
                    toolPanel: filterPanel,
                },
            ],
            defaultToolPanel: '',
        },
        statusBar: {
            statusPanels: [{ statusPanel: 'agAggregationComponent' }],
        },
        enableRangeSelection: true,
        getContextMenuItems,
    }

    // eslint-disable-next-line consistent-return
    const categoryOptions = () => {
        if (dimension === 'category') {
            return [
                {
                    field: 'percent',
                    headerName: '%',
                    pinned: true,
                    sortable: true,
                    aggFunc: 'sum',
                    // hide: true,
                    resizable: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? `${param.value.toFixed(2)}%` : ''
                    },
                },
                {
                    field: 'category',
                    headerName: 'Category',
                    rowGroup: dimension === 'category',
                    enableRowGroup: true,
                    // hide: true,
                    sortable: true,
                    resizable: true,
                    pinned: true,
                },
            ]
        }
        return []
    }

    useEffect(() => {
        if (!isLoading) {
            const defaultCols: ColDef[] = [
                {
                    field: 'connector',
                    headerName: 'Connector',
                    type: 'connector',
                    enableRowGroup: true,
                    resizable: true,
                    sortable: true,
                    pinned: true,
                    hide: true,
                },
                {
                    field: 'dimension',
                    headerName: dimensionName(),
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
                {
                    field: 'accountId',
                    headerName: 'Provider ID',
                    sortable: true,
                    resizable: true,
                    pivot: false,
                    pinned: true,
                },
                {
                    field: 'totalCost',
                    headerName: 'Total Cost',
                    sortable: true,
                    aggFunc: 'sum',
                    resizable: true,
                    pivot: false,
                    pinned: true,
                    valueFormatter: (param: ValueFormatterParams) => {
                        return param.value ? exactPriceDisplay(param.value) : ''
                    },
                },
                ...categoryOptions(),
            ]

            const columnNames =
                response
                    ?.map((row) => {
                        if (row.costValue) {
                            return Object.entries(row.costValue).map(
                                (value) => value[0]
                            )
                        }
                        return []
                    })
                    .flat() || []

            const dynamicCols: ColDef[] = columnNames
                .filter((value, index, array) => array.indexOf(value) === index)
                .map((colName) => {
                    const v: ColDef = {
                        field: colName,
                        headerName: colName,
                        sortable: true,
                        suppressMenu: true,
                        resizable: true,
                        pivot: false,
                        valueFormatter: (param) => {
                            return param.value
                                ? exactPriceDisplay(param.value)
                                : ''
                        },
                    }
                    return v
                })

            const cols = [...defaultCols, ...dynamicCols]
            const rows =
                response?.map((row) => {
                    let temp = {}
                    let totalCost = 0
                    if (row.costValue) {
                        temp = Object.fromEntries(Object.entries(row.costValue))
                    }
                    Object.values(temp).map(
                        // eslint-disable-next-line no-return-assign
                        (v: number | unknown) => (totalCost += Number(v))
                    )
                    return {
                        dimension: row.dimensionName
                            ? row.dimensionName
                            : row.dimensionId,
                        category: row.category,
                        accountId: row.accountID,
                        connector: row.connector,
                        totalCost,
                        ...temp,
                    }
                }) || []
            let sum = 0
            const newRow = []
            for (let i = 0; i < rows.length; i += 1) {
                sum += rows[i].totalCost
            }
            for (let i = 0; i < rows.length; i += 1) {
                newRow.push({
                    ...rows[i],
                    percent: (rows[i].totalCost / sum) * 100,
                })
            }
            gridRef.current?.api?.setColumnDefs(cols)
            gridRef.current?.api?.setRowData(newRow)
        }
    }, [isLoading, dimension])

    return (
        <Menu currentPage="spend">
            <Header
                title="Spend"
                breadCrumb={['Spend Detail']}
                filter
                datePicker
            />
            <Card>
                <Flex>
                    <Title className="font-semibold">Spend details</Title>
                    <Flex className="gap-4 w-fit">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                gridRef.current?.api?.exportDataAsCsv()
                            }}
                            icon={ArrowDownOnSquareIcon}
                        >
                            Download
                        </Button>
                    </Flex>
                </Flex>
                <div className="ag-theme-alpine mt-4">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                    />
                </div>
            </Card>
        </Menu>
    )
}
