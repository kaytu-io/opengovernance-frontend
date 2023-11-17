import dayjs, { Dayjs } from 'dayjs'
import {
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Chart from '../Chart'
import { dateDisplay } from '../../utilities/dateDisplay'

interface IBreakdown {
    activeTime?: { start: Dayjs; end: Dayjs }
    chartData: (string | number | undefined | any)[]
    oldChartData?: (string | number | undefined)[]
    seeMore?: string
    isCost?: boolean
    title?: string
    loading: boolean
}

export default function Breakdown({
    chartData,
    oldChartData,
    loading,
    activeTime,
    seeMore,
    isCost = false,
    title,
}: IBreakdown) {
    const navigate = useNavigate()
    const [selectedIndex, setSelectedIndex] = useState(1)

    return (
        <Card className="pb-0 relative h-full">
            <Flex>
                <Title className="font-semibold">{title || 'Breakdown'}</Title>
                {!!activeTime && (
                    <TabGroup
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                        className="w-fit rounded-lg"
                    >
                        <TabList variant="solid">
                            <Tab className="pt-0.5 pb-1">
                                <Text>
                                    {dateDisplay(
                                        dayjs.utc(
                                            activeTime?.start
                                                .startOf('day')
                                                .toString()
                                        )
                                    )}
                                </Text>
                            </Tab>
                            <Tab className="pt-0.5 pb-1">
                                <Text>
                                    {dateDisplay(
                                        dayjs.utc(
                                            activeTime?.end
                                                .endOf('day')
                                                .toString()
                                        )
                                    )}
                                </Text>
                            </Tab>
                        </TabList>
                    </TabGroup>
                )}
            </Flex>
            <Chart
                labels={[]}
                chartData={
                    activeTime && selectedIndex === 0 ? oldChartData : chartData
                }
                chartType="doughnut"
                isCost={isCost}
                loading={loading}
                colorful
            />
            {!!seeMore && (
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    className="absolute bottom-6 right-6"
                    onClick={() => navigate(`${seeMore}`)}
                >
                    see more
                </Button>
            )}
        </Card>
    )
}
