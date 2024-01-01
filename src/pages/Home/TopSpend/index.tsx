import {
    Badge,
    BadgeDelta,
    Button,
    Card,
    Divider,
    Flex,
    Icon,
    MultiSelect,
    MultiSelectItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { ArrowRightIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { useNavigate, useParams } from 'react-router-dom'
import { useInventoryApiV2AnalyticsSpendMetricList } from '../../../api/inventory.gen'
import {
    badgeDelta,
    deltaChange,
    percentageByChange,
} from '../../../utilities/deltaType'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { spendTimeAtom } from '../../../store'

export default function TopSpend() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    const start = dayjs
        .utc()
        .subtract(2, 'day')
        .subtract(1, 'week')
        .startOf('day')
    const end = dayjs.utc().subtract(2, 'day').endOf('day')

    const { response: metricCost, isLoading } =
        useInventoryApiV2AnalyticsSpendMetricList({
            pageSize: 3,
            pageNumber: 1,
            sortBy: 'growth_rate',
            startTime: start.unix(),
            endTime: end.unix(),
        })

    return (
        <Card>
            <Flex flexDirection="row" justifyContent="between" className="mb-6">
                <Flex flexDirection="row" justifyContent="start">
                    <Icon
                        variant="light"
                        icon={BanknotesIcon}
                        size="lg"
                        color="blue"
                        className="mr-2"
                    />
                    <Title>Top spend trends</Title>
                </Flex>
                <Button
                    size="xs"
                    variant="light"
                    icon={ArrowRightIcon}
                    iconPosition="right"
                    className="mt-2"
                    onClick={() => {
                        navigate(`/${workspace}/spend/spend-details#metrics`)
                    }}
                >
                    See more
                </Button>
            </Flex>
            <Flex
                flexDirection="row"
                justifyContent="between"
                className="w-full my-2"
            >
                <Text>Metric</Text>
                <Flex
                    flexDirection="row"
                    alignItems="end"
                    justifyContent="between"
                    className="w-44"
                >
                    <Text>Change ($)</Text>
                    <Text>Percentage</Text>
                </Flex>
            </Flex>

            <Flex
                flexDirection="col"
                className={isLoading ? 'animate-pulse' : ''}
            >
                {isLoading
                    ? [1, 2, 3].map((i) => (
                          <>
                              <Divider className="p-0 m-0" />
                              <Flex
                                  flexDirection="row"
                                  justifyContent="between"
                                  className="w-full py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                              >
                                  <div className="h-2 w-36 my-2 bg-slate-200 rounded" />
                                  <Flex
                                      flexDirection="row"
                                      justifyContent="between"
                                      className="w-44"
                                  >
                                      <div className="h-2 w-8 my-2 bg-slate-200 rounded" />
                                      <div className="h-7 w-20 my-0 bg-slate-200 rounded" />
                                  </Flex>
                              </Flex>
                          </>
                      ))
                    : metricCost?.metrics?.map((item) => (
                          <>
                              <Divider className="p-0 m-0" />
                              <Flex
                                  flexDirection="row"
                                  justifyContent="between"
                                  className="w-full py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                                  onClick={() => {
                                      navigate(
                                          `/${workspace}/spend/metric_${item.cost_dimension_id}`
                                      )
                                  }}
                              >
                                  <span className="flex-1 text-black text-base truncate">
                                      {item.cost_dimension_name}
                                  </span>
                                  <Flex
                                      flexDirection="row"
                                      justifyContent="between"
                                      className="w-44"
                                  >
                                      <span className="mr-2 text-black font-bold text-base">
                                          {exactPriceDisplay(
                                              deltaChange(
                                                  item.daily_cost_at_start_time,
                                                  item.daily_cost_at_end_time
                                              )
                                          )}
                                      </span>

                                      {badgeDelta(
                                          item.daily_cost_at_start_time,
                                          item.daily_cost_at_end_time,
                                          false,
                                          true
                                      )}
                                  </Flex>
                              </Flex>
                          </>
                      ))}
            </Flex>
        </Card>
    )
}
