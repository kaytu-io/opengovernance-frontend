import { Link, useParams } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import {
    Button,
    Card,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
    Badge,
    Metric,
    Icon,
    TabPanels,
    TabPanel,
} from '@tremor/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import {
    DocumentDuplicateIcon,
    DocumentTextIcon,
    CommandLineIcon,
    Square2StackIcon,
    ClockIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline'
import clipboardCopy from 'clipboard-copy'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { notificationAtom, queryAtom } from '../../../store'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import { useComplianceApiV1ControlsSummaryDetail } from '../../../api/compliance.gen'
import Spinner from '../../../components/Spinner'
import Modal from '../../../components/Modal'
import TopHeader from '../../../components/Layout/Header'
import { useFilterState } from '../../../utilities/urlstate'
import SummaryCard from '../../../components/Cards/SummaryCard'
import EaseOfSolutionChart from '../../../components/EaseOfSolutionChart'
import ImpactedResources from '../../Governance/Controls/ControlSummary/Tabs/ImpactedResources'
import ImpactedAccounts from '../../Governance/Controls/ControlSummary/Tabs/ImpactedAccounts'
import { severityBadge } from '../../Governance/Controls'
import { SourceType } from '../../../api/api'
import DrawerPanel from '../../../components/DrawerPanel'

export default function ScoreDetails() {
    const { id, ws } = useParams()
    const { value: selectedConnections } = useFilterState()

    const [doc, setDoc] = useState('')
    const [docTitle, setDocTitle] = useState('')
    const [modalData, setModalData] = useState('')
    const [explanationModalData, setExplanationModalData] = useState('')
    const setNotification = useSetAtom(notificationAtom)
    const setQuery = useSetAtom(queryAtom)
    const [hideTabs, setHideTabs] = useState(false)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const { response: controlDetail, isLoading } =
        useComplianceApiV1ControlsSummaryDetail(String(id), {
            connectionId: selectedConnections.connections,
        })

    const costSaving = 0

    return (
        <>
            <TopHeader
                breadCrumb={[
                    !isLoading ? controlDetail?.control?.title : 'Score detail',
                ]}
                filter
            />
            {isLoading ? (
                <Flex justifyContent="center" className="mt-56">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    <Flex flexDirection="col" className="mb-8 mt-4 gap-4">
                        <Flex justifyContent="start" className="gap-4">
                            <Metric className="font-semibold whitespace-nowrap">
                                {controlDetail?.control?.title}
                            </Metric>
                            {severityBadge(controlDetail?.control?.severity)}
                        </Flex>
                        <Flex
                            justifyContent="start"
                            alignItems="start"
                            className="gap-10"
                        >
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-6 w-full "
                            >
                                <div className="group w-full relative flex justify-start">
                                    <Text className="truncate">
                                        {controlDetail?.control?.description}
                                    </Text>
                                    <Card className="absolute w-full z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                        <Text>
                                            {
                                                controlDetail?.control
                                                    ?.description
                                            }
                                        </Text>
                                    </Card>
                                </div>

                                <Flex justifyContent="start" className="gap-4">
                                    <Button
                                        icon={DocumentTextIcon}
                                        variant="light"
                                        disabled={
                                            (controlDetail?.control
                                                ?.explanation || '') === ''
                                        }
                                        onClick={() =>
                                            setExplanationModalData(
                                                controlDetail?.control
                                                    ?.explanation || ''
                                            )
                                        }
                                    >
                                        Show Explanation
                                    </Button>
                                    <div className="border-l h-4 border-gray-300" />
                                    <Button
                                        icon={CommandLineIcon}
                                        variant="light"
                                        onClick={() =>
                                            setModalData(
                                                controlDetail?.control?.query
                                                    ?.queryToExecute || ''
                                            )
                                        }
                                    >
                                        Show Query
                                    </Button>
                                </Flex>
                            </Flex>

                            <Flex
                                flexDirection="col"
                                alignItems="end"
                                justifyContent="start"
                                className="w-fit gap-2"
                            >
                                <Badge
                                    icon={Square2StackIcon}
                                    color="gray"
                                    className="hover:cursor-pointer"
                                >
                                    Control ID: {controlDetail?.control?.id}
                                </Badge>
                                <Badge icon={ClockIcon} color="gray">
                                    Last updated:{' '}
                                    {(controlDetail?.evaluatedAt || 0) <= 0
                                        ? 'Never'
                                        : dateTimeDisplay(
                                              controlDetail?.evaluatedAt
                                          )}
                                </Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Modal
                        open={!!modalData.length}
                        onClose={() => setModalData('')}
                    >
                        <Title className="font-semibold">Query</Title>
                        <Card className="my-4">
                            <Editor
                                onValueChange={() => console.log('')}
                                highlight={(text) =>
                                    highlight(text, languages.sql, 'sql')
                                }
                                value={modalData}
                                className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                style={{
                                    minHeight: '200px',
                                }}
                                placeholder="-- write your SQL query here"
                            />
                        </Card>
                        <Flex>
                            <Button
                                variant="light"
                                icon={DocumentDuplicateIcon}
                                iconPosition="left"
                                onClick={() =>
                                    clipboardCopy(modalData).then(() =>
                                        setNotification({
                                            text: 'Query copied to clipboard',
                                            type: 'info',
                                        })
                                    )
                                }
                            >
                                Copy
                            </Button>
                            <Flex className="w-fit gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setQuery(modalData)
                                    }}
                                >
                                    <Link to={`/${ws}/query`}>
                                        Open in Query
                                    </Link>
                                </Button>
                                <Button onClick={() => setModalData('')}>
                                    Close
                                </Button>
                            </Flex>
                        </Flex>
                    </Modal>

                    <Modal
                        open={!!explanationModalData.length}
                        onClose={() => setExplanationModalData('')}
                    >
                        <Title className="font-semibold">Explanation</Title>
                        <Card className="my-4">
                            <Editor
                                onValueChange={() => console.log('')}
                                highlight={(text) =>
                                    highlight(text, languages.sql, 'sql')
                                }
                                value={modalData}
                                className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                                style={{
                                    minHeight: '200px',
                                }}
                                placeholder="-- write your SQL query here"
                            />
                        </Card>
                        <Flex>
                            <Flex className="w-fit gap-4">
                                <Button
                                    onClick={() => setExplanationModalData('')}
                                >
                                    Close
                                </Button>
                            </Flex>
                        </Flex>
                    </Modal>
                    <Flex justifyContent="start" className="w-full mb-8 gap-6">
                        {costSaving !== 0 && (
                            <SummaryCard
                                title="Estimated Saving Opportunities "
                                metric={costSaving} // TODO-Saleh add saving opportunities
                                isPrice
                            />
                        )}

                        <SummaryCard
                            title={
                                controlDetail?.resourceType?.resource_name || ''
                            }
                            metric={controlDetail?.totalResourcesCount}
                            onClick={() => {
                                setSelectedTabIndex(0)
                            }}
                            cardClickable
                        />
                        <SummaryCard
                            connector={controlDetail?.control?.connector}
                            title={
                                controlDetail?.control?.connector ===
                                SourceType.CloudAWS
                                    ? 'AWS Accounts'
                                    : 'Azure Subscriptions'
                            }
                            metric={controlDetail?.totalConnectionCount}
                            onClick={() => {
                                setSelectedTabIndex(1)
                            }}
                            cardClickable
                        />
                    </Flex>

                    <Card className="mb-8 p-8">
                        <Flex
                            justifyContent="start"
                            alignItems="start"
                            className="gap-12"
                        >
                            <Flex
                                className="w-1/3 h-full"
                                justifyContent="start"
                            >
                                <EaseOfSolutionChart
                                    isEmpty
                                    scalability="medium"
                                    complexity="hard"
                                    disruptivity="easy"
                                />
                            </Flex>

                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                justifyContent="start"
                                className="h-full w-2/3"
                            >
                                <DrawerPanel
                                    title={docTitle}
                                    open={doc.length > 0}
                                    onClose={() => setDoc('')}
                                >
                                    <MarkdownPreview
                                        source={doc}
                                        className="!bg-transparent"
                                        wrapperElement={{
                                            'data-color-mode': 'light',
                                        }}
                                        rehypeRewrite={(
                                            node,
                                            index,
                                            parent
                                        ) => {
                                            if (
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                node.tagName === 'a' &&
                                                parent &&
                                                /^h(1|2|3|4|5|6)/.test(
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    parent.tagName
                                                )
                                            ) {
                                                // eslint-disable-next-line no-param-reassign
                                                parent.children =
                                                    parent.children.slice(1)
                                            }
                                        }}
                                    />
                                </DrawerPanel>
                                <Text className="font-bold mb-4 text-gray-400">
                                    Remediation
                                </Text>
                                <Flex className="rounded-lg border border-gray-100 relative">
                                    <Grid
                                        numItems={2}
                                        className="w-full h-full"
                                    >
                                        <Flex
                                            className={
                                                controlDetail?.control
                                                    ?.manualRemediation &&
                                                controlDetail?.control
                                                    ?.manualRemediation.length
                                                    ? 'cursor-pointer px-6 py-4 h-full gap-3 '
                                                    : 'grayscale opacity-70 px-6 py-4 h-full gap-3'
                                            }
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            onClick={() => {
                                                if (
                                                    controlDetail?.control
                                                        ?.manualRemediation &&
                                                    controlDetail?.control
                                                        ?.manualRemediation
                                                        .length
                                                ) {
                                                    setDoc(
                                                        controlDetail?.control
                                                            ?.manualRemediation
                                                    )
                                                    setDocTitle(
                                                        'Manual remediation'
                                                    )
                                                }
                                            }}
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={BookOpenIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Manual
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Step by Step Guided solution to
                                                resolve instances of
                                                non-compliance
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className={
                                                controlDetail?.control
                                                    ?.cliRemediation &&
                                                controlDetail?.control
                                                    ?.cliRemediation.length
                                                    ? 'cursor-pointer px-6 py-4 h-full gap-3 '
                                                    : 'grayscale opacity-70 px-6 py-4 h-full gap-3'
                                            }
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            onClick={() => {
                                                if (
                                                    controlDetail?.control
                                                        ?.cliRemediation &&
                                                    controlDetail?.control
                                                        ?.cliRemediation.length
                                                ) {
                                                    setDoc(
                                                        controlDetail?.control
                                                            ?.cliRemediation
                                                    )
                                                    setDocTitle(
                                                        'Command line (CLI) remediation'
                                                    )
                                                }
                                            }}
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={CommandLineIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Command line (CLI)
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Guided steps to resolve the
                                                issue utilizing CLI
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className={
                                                controlDetail?.control
                                                    ?.guardrailRemediation &&
                                                controlDetail?.control
                                                    ?.guardrailRemediation
                                                    .length
                                                    ? 'cursor-pointer px-6 py-4 h-full gap-3 '
                                                    : 'grayscale opacity-70 px-6 py-4 h-full gap-3'
                                            }
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            onClick={() => {
                                                if (
                                                    controlDetail?.control
                                                        ?.guardrailRemediation &&
                                                    controlDetail?.control
                                                        ?.guardrailRemediation
                                                        .length
                                                ) {
                                                    setDoc(
                                                        controlDetail?.control
                                                            ?.guardrailRemediation
                                                    )
                                                    setDocTitle(
                                                        'Guard rails remediation'
                                                    )
                                                }
                                            }}
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={Cog8ToothIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Guard rails
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Resolve and ensure compliance,
                                                at scale utilizing solutions
                                                where possible
                                            </Text>
                                        </Flex>
                                        <Flex
                                            className={
                                                controlDetail?.control
                                                    ?.programmaticRemediation &&
                                                controlDetail?.control
                                                    ?.programmaticRemediation
                                                    .length
                                                    ? 'cursor-pointer px-6 py-4 h-full gap-3 '
                                                    : 'grayscale opacity-70 px-6 py-4 h-full gap-3'
                                            }
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            onClick={() => {
                                                if (
                                                    controlDetail?.control
                                                        ?.programmaticRemediation &&
                                                    controlDetail?.control
                                                        ?.programmaticRemediation
                                                        .length
                                                ) {
                                                    setDoc(
                                                        controlDetail?.control
                                                            ?.programmaticRemediation
                                                    )
                                                    setDocTitle(
                                                        'Programmatic remediation'
                                                    )
                                                }
                                            }}
                                        >
                                            <Flex>
                                                <Flex
                                                    justifyContent="start"
                                                    className="w-fit gap-3"
                                                >
                                                    <Icon
                                                        icon={CodeBracketIcon}
                                                        className="p-0 text-gray-900"
                                                    />
                                                    <Title className="font-semibold">
                                                        Programmatic
                                                    </Title>
                                                </Flex>
                                                <ChevronRightIcon className="w-5 text-kaytu-500" />
                                            </Flex>
                                            <Text>
                                                Scripts that help you resolve
                                                the issue, at scale
                                            </Text>
                                        </Flex>
                                    </Grid>
                                    <div className="border-t border-gray-100 w-full absolute top-1/2" />
                                    <div className="border-l border-gray-100 h-full absolute left-1/2" />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* <Flex
                        flexDirection="row"
                        justifyContent="center"
                        onClick={() => setHideTabs(!hideTabs)}
                        className="text-blue-500 cursor-pointer"
                    >
                        <Text className="text-blue-500">
                            {hideTabs ? 'Show' : 'Hide'} Results
                        </Text>
                        {hideTabs ? (
                            <ChevronDownIcon className="ml-2 w-4" />
                        ) : (
                            <ChevronUpIcon className="ml-2 w-4" />
                        )}
                    </Flex> */}

                    {!hideTabs && (
                        <TabGroup
                            key={`tabs-${selectedTabIndex}`}
                            defaultIndex={selectedTabIndex}
                            tabIndex={selectedTabIndex}
                            onIndexChange={setSelectedTabIndex}
                        >
                            <TabList>
                                <Tab>Impacted resources</Tab>
                                <Tab>Impacted accounts</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {selectedTabIndex === 0 && (
                                        <ImpactedResources
                                            controlId={
                                                controlDetail?.control?.id
                                            }
                                        />
                                    )}
                                </TabPanel>
                                <TabPanel>
                                    {selectedTabIndex === 1 && (
                                        <ImpactedAccounts
                                            controlId={
                                                controlDetail?.control?.id
                                            }
                                        />
                                    )}
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    )}
                </>
            )}
        </>
    )
}
