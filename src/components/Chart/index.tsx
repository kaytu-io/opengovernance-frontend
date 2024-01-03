import ReactEcharts from 'echarts-for-react'
import { Flex, Text } from '@tremor/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import {
    exactPriceDisplay,
    numberDisplay,
    numericDisplay,
} from '../../utilities/numericDisplay'

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData:
        | (string | number | undefined)[]
        | (
              | {
                    name: string
                    value: string
                    itemStyle?: undefined
                    label?: undefined
                }
              | {
                    value: number
                    name: string
                    itemStyle: { color: string; decal: { symbol: string } }
                    label: { show: boolean }
                }
          )[]
        | (
              | {
                    name: string
                    value: number | undefined
                    itemStyle?: undefined
                    label?: undefined
                }
              | {
                    value: number
                    name: string
                    itemStyle: { color: string; decal: { symbol: string } }
                    label: { show: boolean }
                }
          )[]
        | undefined
    chartType: 'bar' | 'line' | 'doughnut' | 'half-doughnut'
    chartLayout?: 'stacked' | 'basic'
    chartAggregation?: 'trend' | 'cumulative'
    visualMap?: any
    markArea?: any
    isCost?: boolean
    isPercent?: boolean
    loading?: boolean
    error?: string
    onRefresh?: () => void
    onClick?: (param?: any) => void
    colorful?: boolean
}

export default function Chart({
    labels,
    labelType = 'category',
    chartData,
    chartType,
    chartLayout,
    chartAggregation,
    isCost = false,
    isPercent = false,
    markArea,
    visualMap,
    loading,
    error,
    onRefresh,
    onClick,
    colorful = false,
}: IChart) {
    const options = () => {
        if (chartLayout === 'basic') {
            if (chartAggregation === 'trend') {
                return {
                    xAxis: {
                        type: labelType,
                        data: labels,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: (value: string | number) => {
                                if (isCost) {
                                    return `$${numericDisplay(value)}`
                                }
                                if (isPercent) {
                                    return `${numericDisplay(value)} %`
                                }
                                return numericDisplay(value)
                            },
                        },
                    },
                    visualMap,
                    animation: false,
                    series: [
                        chartType === 'bar' && {
                            data: chartData,
                            type: chartType,
                            areaStyle: { opacity: 0 },
                        },
                        chartType === 'line' && {
                            data: chartData,
                            markArea,
                            type: chartType,
                            areaStyle: { opacity: 0 },
                        },
                    ],
                    grid: {
                        left: 45,
                        right: 0,
                        top: 20,
                        bottom: 40,
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        valueFormatter: (value: string | number) => {
                            if (isCost) {
                                return `$${numberDisplay(Number(value), 2)}`
                            }
                            if (isPercent) {
                                return `${numericDisplay(value)} %`
                            }
                            return numberDisplay(Number(value), 0)
                        },
                    },
                    color: colorful
                        ? [
                              '#780000',
                              '#DC0000',
                              '#FD8C00',
                              '#FDC500',
                              '#10B880',
                              '#D0D4DA',
                          ]
                        : [
                              '#1D4F85',
                              '#2970BC',
                              '#6DA4DF',
                              '#96BEE8',
                              '#C0D8F1',
                              '#D0D4DA',
                          ],
                }
            }
            if (chartAggregation === 'cumulative') {
                return {
                    xAxis: {
                        type: labelType,
                        data: labels,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: (value: string | number) => {
                                if (isCost) {
                                    return `$${numericDisplay(value)}`
                                }
                                if (isPercent) {
                                    return `${numericDisplay(value)} %`
                                }
                                return numericDisplay(value)
                            },
                        },
                    },
                    visualMap,
                    animation: false,
                    series: [
                        chartType === 'bar' && {
                            data: chartData,
                            type: chartType,
                            areaStyle: { opacity: 0 },
                        },
                        chartType === 'line' && {
                            data: chartData,
                            markArea,
                            type: chartType,
                            areaStyle: { opacity: 0.7 },
                        },
                    ],
                    grid: {
                        left: 45,
                        right: 0,
                        top: 20,
                        bottom: 40,
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        valueFormatter: (value: string | number) => {
                            if (isCost) {
                                return `$${numberDisplay(Number(value), 2)}`
                            }
                            if (isPercent) {
                                return `${numericDisplay(value)} %`
                            }
                            return numberDisplay(Number(value), 0)
                        },
                    },
                    color: colorful
                        ? [
                              '#780000',
                              '#DC0000',
                              '#FD8C00',
                              '#FDC500',
                              '#10B880',
                              '#D0D4DA',
                          ]
                        : [
                              '#1D4F85',
                              '#2970BC',
                              '#6DA4DF',
                              '#96BEE8',
                              '#C0D8F1',
                              '#D0D4DA',
                          ],
                }
            }
            return {}
        }
        if (chartLayout === 'stacked') {
            if (chartType === 'line') {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985',
                            },
                        },
                    },
                    legend: {
                        data: [
                            'Email',
                            'Union Ads',
                            'Video Ads',
                            'Direct',
                            'Search Engine',
                        ],
                    },

                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: [
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                                'Sun',
                            ],
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                        },
                    ],
                    series: [
                        {
                            name: 'Email',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series',
                            },
                            data: [120, 132, 101, 134, 90, 230, 210],
                        },
                        {
                            name: 'Union Ads',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series',
                            },
                            data: [220, 182, 191, 234, 290, 330, 310],
                        },
                        {
                            name: 'Video Ads',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series',
                            },
                            data: [150, 232, 201, 154, 190, 330, 410],
                        },
                        {
                            name: 'Direct',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series',
                            },
                            data: [320, 332, 301, 334, 390, 330, 320],
                        },
                        {
                            name: 'Search Engine',
                            type: 'line',
                            stack: 'Total',
                            label: {
                                show: true,
                                position: 'top',
                            },
                            areaStyle: {},
                            emphasis: {
                                focus: 'series',
                            },
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                        },
                    ],
                }
            }
            if (chartType === 'bar') {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                        },
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                                'Sun',
                            ],
                        },
                    ],
                    yAxis: [
                        {
                            type: 'value',
                        },
                    ],
                    series: [
                        {
                            name: 'Email',
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                                focus: 'series',
                            },
                            data: [120, 132, 101, 134, 90, 230, 210],
                        },
                        {
                            name: 'Union Ads',
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                                focus: 'series',
                            },
                            data: [220, 182, 191, 234, 290, 330, 310],
                        },
                        {
                            name: 'Video Ads',
                            type: 'bar',
                            stack: 'Ad',
                            emphasis: {
                                focus: 'series',
                            },
                            data: [150, 232, 201, 154, 190, 330, 410],
                        },
                    ],
                }
            }
            return undefined
        }
        if (chartType === 'doughnut') {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                        return `${params.data.name} (${params.percent}%):\n\n${
                            isCost
                                ? exactPriceDisplay(params.data.value)
                                : numberDisplay(params.data.value, 0)
                        }`
                    },
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['47%', '70%'],
                        // center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: true,
                            position: 'center',
                            formatter: () => {
                                let total = 0
                                for (
                                    let i = 0;
                                    i < (chartData ? chartData?.length : 0);
                                    i += 1
                                ) {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    total += Number(chartData[i].value)
                                }

                                return `Total: ${
                                    isCost
                                        ? exactPriceDisplay(total)
                                        : numberDisplay(total, 0)
                                }`
                            },
                        },
                        itemStyle: {
                            borderRadius: 4,
                            borderColor: '#fff',
                            borderWidth: 1,
                        },
                        data: chartData,
                        left: '-5%',
                        width: '70%',
                    },
                ],
                legend: {
                    right: 12,
                    top: 'middle',
                    icon: 'circle',
                    orient: 'vertical',
                    textStyle: {
                        width: 140,
                        overflow: 'truncate',
                    },
                },
                color: colorful
                    ? [
                          '#780000',
                          '#DC0000',
                          '#FD8C00',
                          '#FDC500',
                          '#10B880',
                          '#D0D4DA',
                      ]
                    : [
                          '#1E7CE0',
                          '#2ECC71',
                          '#FFA500',
                          '#9B59B6',
                          '#D0D4DA',
                          // '#D0D4DA',
                      ],
            }
        }
        if (chartType === 'half-doughnut') {
            return {
                tooltip: {
                    trigger: 'item',
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['40%', '63%'],
                        // adjust the start angle
                        startAngle: 180,
                        label: {
                            show: false,
                        },
                        data: chartData,
                    },
                ],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                color: ['#C0D8F1', '#0D2239'],
            }
        }
        return {}
    }

    const onEvents = {
        click: (params: any) => (onClick ? onClick(params) : undefined),
    }

    if (error !== undefined && error.length > 0) {
        return (
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                className="cursor-pointer w-full h-80"
                onClick={onRefresh}
            >
                <Text className="text-gray-400 mr-2 w-auto">
                    Error loading {error}
                </Text>
                <Flex
                    flexDirection="row"
                    justifyContent="end"
                    className="w-auto"
                >
                    <ArrowPathIcon className="text-kaytu-500 w-4 h-4 mr-1" />
                    <Text className="text-kaytu-500">Reload</Text>
                </Flex>
            </Flex>
        )
    }

    return (
        <ReactEcharts
            option={options()}
            showLoading={loading}
            className="w-full"
            onEvents={
                chartType === 'bar' || chartType === 'line'
                    ? onEvents
                    : undefined
            }
        />
    )
}
