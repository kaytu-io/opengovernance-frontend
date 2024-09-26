import dayjs from 'dayjs'
import {
    Flex,
    Text,
    Title,
    Subtitle,
    Metric,
    Badge,
    ProgressCircle,
    Button,
    Card,
    Grid,
} from '@tremor/react'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ArrowPathIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../api/schedule.gen'
import { notificationAtom } from '../../../store'
import ScoreCategoryCard from '../../../components/Cards/ScoreCategoryCard'
import TopHeader from '../../../components/Layout/Header'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult,
    SourceType,
} from '../../../api/api'
import { useFilterState } from '../../../utilities/urlstate'
import { getErrorMessage, toErrorMessage } from '../../../types/apierror'
import Modal from '../../../components/Modal'

const severityColor = [
    {
        name: 'critical',
        title: 'Critical Risk',
        color: 'rose',
    },
    {
        name: 'high',
        title: 'High Risk',
        color: 'orange',
    },
    {
        name: 'medium',
        title: 'Medium Risk',
        color: 'amber',
    },
    {
        name: 'low',
        title: 'Low Risk',
        color: 'yellow',
    },
    {
        name: 'none',
        title: 'None',
        color: 'gray',
    },
    {
        name: 'passed',
        title: 'Passed',
        color: 'emerald',
    },
]

function SecurityScore(
    v:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult[]
        | undefined
) {
    const total =
        v?.map((t) => t.total || 0).reduce((prev, curr) => prev + curr, 0) || 0
    const passed =
        v?.map((t) => t.passed || 0).reduce((prev, curr) => prev + curr, 0) || 0

    if (total === 0) {
        return 0
    }
    return (passed / total) * 100
}

function fixSort(t: string) {
    return t
        .replaceAll('s', 'a')
        .replaceAll('S', 'a')
        .replaceAll('c', 'b')
        .replaceAll('C', 'b')
        .replaceAll('o', 'c')
        .replaceAll('O', 'c')
        .replaceAll('r', 'd')
        .replaceAll('R', 'd')
        .replaceAll('E', 'e')
}

interface MR {
    category: string
    title: string
    summary: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary[]
}

export default function ScoreOverview() {
    const { value: selectedConnections } = useFilterState()
    const setNotification = useSetAtom(notificationAtom)
    const [openConfirm, setOpenConfirm] = useState<boolean>(false)

    const query = {
        ...{ tag: ['type=SCORE'] },
        ...(selectedConnections.connections.length > 0 && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.provider !== SourceType.Nil && {
            connector: [selectedConnections.provider],
        }),
    }
    const {
        response,
        error: summaryListError,
        isLoading,
        sendNow: refresh,
    } = useComplianceApiV1BenchmarksSummaryList(query)

    const {
        sendNowWithParams: triggerEvaluate,
        isExecuted,
        error,
        isLoading: triggerIsLoading,
    } = useScheduleApiV1ComplianceTriggerUpdate(
        {
            benchmark_id: [],
        },
        {},
        false
    )

    useEffect(() => {
        if (isExecuted && !triggerIsLoading) {
            const err = getErrorMessage(error)
            if (err === '') {
                setNotification({
                    text: 'Evaluation triggered',
                    type: 'success',
                    position: 'bottomLeft',
                })
            } else {
                setNotification({
                    text: `Evaluation trigger failed due to ${err}`,
                    type: 'error',
                    position: 'bottomLeft',
                })
            }
        }
    }, [triggerIsLoading])

    const responseSorted = response?.benchmarkSummary?.sort((a, b) => {
        const aTitle = fixSort(a.title || '')
        const bTitle = fixSort(b.title || '')

        if (a.title === b.title) {
            return 0
        }

        return aTitle < bTitle ? -1 : 1
    })
    const controlTotal =
        responseSorted?.map((i) => i.controlsSeverityStatus?.total) || []
    const total = controlTotal
        .map((i) => i?.total || 0)
        .reduce((prev, curr) => prev + curr, 0)
    const passed = controlTotal
        .map((i) => i?.passed || 0)
        .reduce((prev, curr) => prev + curr, 0)

    const securityScore = (passed / total) * 100

    const severityMap = responseSorted
        ?.map((v) => v.controlsSeverityStatus)
        .reduce(
            (prev, curr) => {
                return {
                    critical: prev.critical + (curr?.critical?.total || 0),
                    high: prev.high + (curr?.high?.total || 0),
                    medium: prev.medium + (curr?.medium?.total || 0),
                    low: prev.low + (curr?.low?.total || 0),
                    none: prev.none + (curr?.none?.total || 0),
                }
            },
            {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                none: 0,
            }
        )
    const categories = () => {
        const titleMap = new Map<string, string>()
        titleMap.set('operational_excellence', 'Supportability')
        titleMap.set('reliability', 'Reliability')
        // titleMap.set('security', 'Security')
        // titleMap.set('performance_efficiency', 'Performance Efficiency')
        titleMap.set('cost_optimization', 'Efficiency')

        return (
            responseSorted
                ?.map((i) => {
                    const category =
                        Object.entries(i.tags || {})
                            .filter((t) => t[0] === 'score_category')
                            .flatMap((t) => t[1])
                            .at(0) || ''
                    return {
                        category,
                        summary: i,
                    }
                })
                .reduce<MR[]>((prev, curr) => {
                    if (
                        prev.filter((p) => p.category === curr.category)
                            .length > 0
                    ) {
                        return prev.map((v) => {
                            if (v.category === curr.category) {
                                return {
                                    category: curr.category,
                                    title: titleMap.get(curr.category) || '',
                                    summary: [curr.summary, ...v.summary],
                                }
                            }
                            return v
                        })
                    }
                    return [
                        ...prev,
                        {
                            category: curr.category,
                            title: titleMap.get(curr.category) || '',
                            summary: [curr.summary],
                        },
                    ]
                }, []) || []
        )
    }

    const evaluating =
        (
            response?.benchmarkSummary
                ?.map((b) => {
                    return !(
                        b?.lastJobStatus === 'FAILED' ||
                        b?.lastJobStatus === 'SUCCEEDED' ||
                        (b?.lastJobStatus || '') === ''
                    )
                })
                .filter((l) => l === true) || []
        ).length > 0

    const lastEvaluatedAt =
        response?.benchmarkSummary
            ?.map((b) => dayjs.utc(b.evaluatedAt))
            .reduce((prev, curr) => {
                return curr.isAfter(prev) ? curr : prev
            }, dayjs.utc(0))
            ?.format('MMM DD, YYYY kk:mm UTC') || 'Never'

    console.log(categories())
    return (
        <>
            {/* <TopHeader /> */}

            <Flex
                className="bg-white w-[90%] rounded-xl border-solid  border-2 border-gray-200   "
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
            >
                <div className="border-b w-full rounded-xl border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-gray-950 sm:p-6 lg:p-8">
                    <header>
                        <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            SRE Center
                        </h1>
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Assess your enterprise against SRE best practices
                            and the Well-Architected Framework.
                        </p>
                        <div className="mt-8 w-full md:flex md:max-w-3xl md:items-stretch md:space-x-4">
                            <Card className="w-full md:w-7/12">
                                <div className="inline-flex items-center justify-center rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border">
                                    <DocumentTextIcon
                                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                                        aria-hidden={true}
                                    />
                                </div>
                                <h3 className="mt-4 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    <a
                                        href=" https://docs.opengovernance.io/oss/platform/sre"
                                        target="_blank"
                                        className="focus:outline-none"
                                    >
                                        {/* Extend link to entire card */}
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden={true}
                                        />
                                        Documentation
                                    </a>
                                </h3>
                                <p className="dark:text-dark-tremor-cont text-tremor-default text-tremor-content">
                                    Learn how to use and customize SRE Framework
                                </p>
                            </Card>
                        </div>
                    </header>
                </div>
                <div className="w-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <main>
                            <div className="flex items-center justify-between">
                                {/* <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            Available Dashboards
                                        </h2> */}
                                <div className="flex items-center space-x-2">
                                    {/* <Select
                                        placeholder="Sorty by"
                                        enableClear={false}
                                        className="[&>button]:rounded-tremor-small"
                                    >
                                        <SelectItem value="1">Name</SelectItem>
                                        <SelectItem value="2">
                                            Last edited
                                        </SelectItem>
                                        <SelectItem value="3">Size</SelectItem>
                                    </Select> */}
                                    {/* <button
                                                type="button"
                                                onClick={() => {
                                                    f()
                                                    setOpen(true)
                                                }}
                                                className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:inline-flex"
                                            >
                                                <PlusIcon
                                                    className="-ml-1 size-5 shrink-0"
                                                    aria-hidden={true}
                                                />
                                                Create new Dashboard
                                            </button> */}
                                </div>
                            </div>
                            <div className="flex items-center w-full">
                                <Grid
                                    numItemsMd={3}
                                    numItemsLg={3}
                                    className="gap-[70px] mt-6 w-full justify-items-center"
                                >
                                    {isLoading
                                        ? [1, 2, 3, 4, 5].map((i) => (
                                              <Flex className="gap-6 px-8 py-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:cursor-pointer">
                                                  <Flex className="relative w-fit">
                                                      <ProgressCircle
                                                          value={0}
                                                          size="md"
                                                      >
                                                          <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                                      </ProgressCircle>
                                                  </Flex>

                                                  <Flex
                                                      alignItems="start"
                                                      flexDirection="col"
                                                      className="gap-1"
                                                  >
                                                      <div className="animate-pulse h-3 w-56 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                                  </Flex>
                                              </Flex>
                                          ))
                                        : categories()
                                              .filter((item) => {
                                                  if (
                                                      item.category !==
                                                          'performance_efficiency' &&
                                                      item.category !==
                                                          'security'
                                                  ) {
                                                      return item
                                                  }
                                              })
                                              .sort((a, b) => {
                                                  if (
                                                      a.title ===
                                                          'Supportability' &&
                                                      b.title === 'Efficiency'
                                                  ) {
                                                      return -1
                                                  }
                                                  if (
                                                      a.title ===
                                                          'Efficiency' &&
                                                      b.title ===
                                                          'Supportability'
                                                  ) {
                                                      return 1
                                                  }
                                                  if (
                                                      a.title ===
                                                          'Reliability' &&
                                                      b.title === 'Efficiency'
                                                  ) {
                                                      return -1
                                                  }
                                                  if (
                                                      a.title ===
                                                          'Efficiency' &&
                                                      b.title === 'Reliability'
                                                  ) {
                                                      return 1
                                                  }
                                                  return 0
                                              })
                                              .map((item) => {
                                                  return (
                                                      <ScoreCategoryCard
                                                          title={
                                                              item.title || ''
                                                          }
                                                          percentage={SecurityScore(
                                                              item.summary.map(
                                                                  (c) =>
                                                                      c
                                                                          .controlsSeverityStatus
                                                                          ?.total ||
                                                                      {}
                                                              )
                                                          )}
                                                          costOptimization={
                                                              item.category ===
                                                              'cost_optimization'
                                                                  ? item.summary
                                                                        .map(
                                                                            (
                                                                                b
                                                                            ) =>
                                                                                b.costOptimization ||
                                                                                0
                                                                        )
                                                                        .reduce<number>(
                                                                            (
                                                                                prev,
                                                                                curr
                                                                            ) =>
                                                                                prev +
                                                                                curr,
                                                                            0
                                                                        )
                                                                  : 0
                                                          }
                                                          value={item.summary
                                                              .map(
                                                                  (c) =>
                                                                      c
                                                                          .controlsSeverityStatus
                                                                          ?.total
                                                                          ?.passed ||
                                                                      0
                                                              )
                                                              .reduce<number>(
                                                                  (
                                                                      prev,
                                                                      curr
                                                                  ) =>
                                                                      prev +
                                                                      curr,
                                                                  0
                                                              )}
                                                          kpiText="Issues"
                                                          category={
                                                              item.category
                                                          }
                                                          varient="default"
                                                      />
                                                  )
                                              })}
                                </Grid>
                            </div>
                        </main>
                    </div>
                </div>
            </Flex>
            {toErrorMessage(summaryListError) && (
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="absolute top-0 w-full left-0 h-full backdrop-blur"
                >
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Title className="mt-6">Failed to load component</Title>
                        <Text className="mt-2">
                            {toErrorMessage(summaryListError)}
                        </Text>
                    </Flex>
                    <Button
                        variant="secondary"
                        className="mb-6"
                        color="slate"
                        onClick={() => {
                            refresh()
                        }}
                    >
                        Try Again
                    </Button>
                </Flex>
            )}

            <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <Title>Do you want to run evaluation on all accounts?</Title>
                <Flex className="mt-8">
                    <Button
                        variant="secondary"
                        onClick={() => setOpenConfirm(false)}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            triggerEvaluate(
                                {
                                    benchmark_id:
                                        response?.benchmarkSummary?.map(
                                            (b) => b.id || ''
                                        ) || [],
                                },
                                {}
                            )
                            setOpenConfirm(false)
                        }}
                    >
                        Evaluate
                    </Button>
                </Flex>
            </Modal>
        </>
    )
}
{/**
    
    
            <Flex alignItems="start" className="gap-20">
                <Flex flexDirection="col" className="h-full">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="p-10 border border-gray-300 rounded-xl gap-8"
                    >
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-3"
                        >
                            <Metric>What is SCORE?</Metric>
                            <Subtitle className="text-gray-500">
                                SCORE is a comprehensive evaluation suite that
                                assesses your infrastructure against leading
                                cloud vendor recommendations, ensuring optimal
                                alignment with industry standards and best
                                practices.
                            </Subtitle>
                            <Flex
                                flexDirection="row"
                                justifyContent="start"
                                className="cursor-pointer"
                                onClick={() => setOpenConfirm(true)}
                            >
                                <ArrowPathIcon className="w-4 mr-1 text-blue-600" />
                                <Text className="text-blue-600">
                                    {evaluating ? 'Evaluating' : 'Evaluate Now'}
                                </Text>
                            </Flex>
                            <Text>Last Evaluated: {lastEvaluatedAt}</Text>
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="center"
                            className="gap-2"
                        >
                            <ProgressCircle
                                value={securityScore}
                                size="xl"
                                className="relative"
                            >
                                <Flex flexDirection="col">
                                    {isLoading ? (
                                        <div className="animate-pulse h-3 w-16 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    ) : (
                                        <Title>
                                            {securityScore.toFixed(1)}%
                                        </Title>
                                    )}

                                    <Text>Compliant</Text>
                                </Flex>
                            </ProgressCircle>
                          
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-8"
                        >
                            <Flex justifyContent="start">
                                <div>
                                    {isLoading ? (
                                        <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    ) : (
                                        <span className="mr-1.5 font-bold">
                                            {total}
                                        </span>
                                    )}
                                    insight evaluations performed across
                                    <span className="mx-1.5 font-bold">
                                        all
                                    </span>
                                    cloud accounts
                                </div>
                            </Flex>
                            <Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="rose">
                                            {isLoading ? (
                                                <div className="animate-pulse h-3 w-16 my-0 bg-slate-200 dark:bg-slate-700 rounded" />
                                            ) : (
                                                total - passed
                                            )}
                                        </Metric>

                                        <Subtitle className="text-gray-500 mt-2">
                                            Failed Checks
                                        </Subtitle>
                                    </Flex>

                               
                                </Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="emerald">
                                            {isLoading ? (
                                                <div className="animate-pulse h-3 w-16 my-0 bg-slate-200 dark:bg-slate-700 rounded" />
                                            ) : (
                                                passed
                                            )}
                                        </Metric>
                                        <Subtitle className="text-gray-500">
                                            Passed Checks
                                        </Subtitle>
                                    </Flex>

                                 
                                </Flex>
                            </Flex>
                            <Flex justifyContent="start" className="gap-2">
                                {Object.entries(severityMap || {}).map(
                                    (item) => (
                                        <Flex
                                            flexDirection="col"
                                            className="gap-2"
                                        >
                                            <Badge
                                                color={
                                                    severityColor
                                                        .filter(
                                                            (v) =>
                                                                v.name ===
                                                                item[0]
                                                        )
                                                        .at(0)?.color
                                                }
                                                className="w-full"
                                            >
                                                {item[1]}
                                            </Badge>
                                            <Text>{item[0]}</Text>
                                        </Flex>
                                    )
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDirection="col" className="gap-6">
                    {isLoading
                        ? [1, 2, 3, 4, 5].map((i) => (
                              <Flex className="gap-6 px-8 py-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:cursor-pointer">
                                  <Flex className="relative w-fit">
                                      <ProgressCircle value={0} size="md">
                                          <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                      </ProgressCircle>
                                  </Flex>

                                  <Flex
                                      alignItems="start"
                                      flexDirection="col"
                                      className="gap-1"
                                  >
                                      <div className="animate-pulse h-3 w-56 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                  </Flex>
                              </Flex>
                          ))
                        : categories().map((item) => {
                              return (
                                  <ScoreCategoryCard
                                      title={item.title || ''}
                                      percentage={SecurityScore(
                                          item.summary.map(
                                              (c) =>
                                                  c.controlsSeverityStatus
                                                      ?.total || {}
                                          )
                                      )}
                                      costOptimization={
                                          item.category === 'cost_optimization'
                                              ? item.summary
                                                    .map(
                                                        (b) =>
                                                            b.costOptimization ||
                                                            0
                                                    )
                                                    .reduce<number>(
                                                        (prev, curr) =>
                                                            prev + curr,
                                                        0
                                                    )
                                              : 0
                                      }
                                      value={item.summary
                                          .map(
                                              (c) =>
                                                  c.controlsSeverityStatus
                                                      ?.total?.passed || 0
                                          )
                                          .reduce<number>(
                                              (prev, curr) => prev + curr,
                                              0
                                          )}
                                      kpiText="Issues"
                                      category={item.category}
                                      varient="default"
                                  />
                              )
                          })}
                </Flex>
            </Flex>
    */}