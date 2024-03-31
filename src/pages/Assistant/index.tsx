import { useEffect, useRef, useState } from 'react'
import {
    Button,
    Card,
    Col,
    Flex,
    Grid,
    Icon,
    Select,
    SelectItem,
    Subtitle,
    Tab,
    TabGroup,
    TabList,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import {
    ArrowPathIcon,
    ChevronRightIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
} from '@heroicons/react/24/outline'
import { useAuth0 } from '@auth0/auth0-react'
import { useURLParam } from '../../utilities/urlstate'
import {
    useAssistantApiV1ThreadCreate,
    useAssistantApiV1ThreadDetail,
} from '../../api/assistant.gen'
import {
    errorHandlingWithErrorMessage,
    toErrorMessage,
} from '../../types/apierror'
import { AssistantImage } from '../../icons/icons'

export default function Assistant() {
    const [assistantIdx, setAssistantIdx] = useURLParam(
        'assistantIdx',
        0,
        (v) => String(v),
        (v) => parseInt(v, 10)
    )
    const assistantName = () => {
        switch (assistantIdx) {
            case 1:
                return 'kaytu-assets-assistant'
            case 2:
                return 'kaytu-score-assistant'
            case 3:
                return 'kaytu-assets-assistant'
            case 4:
                return 'kaytu-score-assistant'
            default:
                return 'kaytu-r-assistant'
        }
    }
    const assisstantDetails = [
        {
            title: 'Cloud Inventory',
            name: 'kaytu-assets-assistant',
            description: 'to find thing about cloud inventory',
            idx: 4,
        },
        {
            title: 'Spend',
            name: 'kaytu-assets-assistant',
            description: 'to find thing about Spend',
            idx: 3,
        },
        {
            title: 'SCORE',
            name: 'kaytu-score-assistant',
            description: 'to find thing about SCORE',
            idx: 2,
        },
        {
            title: 'Compliance',
            name: 'kaytu-assets-assistant',
            description: 'to find thing about Compliance',
            idx: 1,
        },
    ]

    const examplePropmts = [
        'This is question number 1 and you can click on this to ask Kaytu assistant',
        'This is question number 2 and you can click on this to ask Kaytu assistant',
        'This is question number 3 and you can click on this to ask Kaytu assistant',
        'This is question number 4 and you can click on this to ask Kaytu assistant',
    ]

    const [threadID, setThreadID] = useURLParam('threadID', '')
    const [runID, setRunID] = useURLParam('runID', '')
    const [content, setContent] = useState('')
    const ref = useRef<HTMLDivElement | null>(null)
    const { response, isLoading, isExecuted, sendNow } =
        useAssistantApiV1ThreadCreate(
            assistantName(),
            {
                thread_id: threadID.length > 0 ? threadID : undefined,
                run_id: undefined,
                content,
            },
            {},
            false
        )

    useEffect(() => {
        if (isExecuted && !isLoading) {
            if (response?.thread_id !== undefined) {
                setThreadID(response?.thread_id || '')
            }

            if (response?.run_id !== undefined) {
                setRunID(response?.run_id || '')
            }

            setContent('')
        }
    }, [isLoading])

    const {
        response: thread,
        isLoading: threadLoading,
        isExecuted: threadExecuted,
        sendNow: refresh,
        error: err,
    } = useAssistantApiV1ThreadDetail(
        threadID,
        assistantName(),
        runID !== undefined
            ? {
                  run_id: runID,
              }
            : {},
        {},
        threadID !== ''
    )

    const isRunning =
        thread?.status === 'queued' ||
        thread?.status === 'in_progress' ||
        thread?.status === 'requires_action'

    const lastMsgCount = useRef<number>(0)
    useEffect(() => {
        if (threadExecuted && !threadLoading) {
            if ((thread?.messages || []).length !== lastMsgCount.current) {
                ref.current?.scrollIntoView({ behavior: 'smooth' })
                lastMsgCount.current = (thread?.messages || []).length
            }
            if (isRunning) {
                setTimeout(() => refresh(), 2500)
            }
        }
    }, [threadLoading])

    const msgList = () => {
        if (threadID === '' && runID === '') {
            return []
        }
        const list = thread?.messages || []
        const reversed = [...list].reverse()
        return reversed
    }
    const findAssistantIndex = (value: string) => {
        const a = assisstantDetails.find((o) => o.name === value)
        if (a !== undefined) return a.idx
        return 0
    }

    const { user, logout } = useAuth0()
    console.log(assistantIdx)
    return (
        <Flex
            flexDirection="col"
            justifyContent="between"
            className="relative h-full"
            alignItems="stretch"
        >
            {assistantIdx !== 0 && msgList().length === 0 && (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className="w-48 gap-1 absolute"
                >
                    <Text className="text-gray-400 ml-1">Assistant</Text>
                    <Select
                        defaultValue={assistantName()}
                        placeholder={
                            assisstantDetails.find(
                                (o) => o.idx === assistantIdx
                            )?.title
                        }
                        onValueChange={(value) =>
                            setAssistantIdx(findAssistantIndex(value))
                        }
                        className="w-full"
                    >
                        {assisstantDetails.map((item) => (
                            <SelectItem value={item.name}>
                                {item.title}
                            </SelectItem>
                        ))}
                    </Select>
                </Flex>
            )}

            <div
                className="w-full overflow-y-scroll"
                style={{
                    height: 'calc(100vh - 120px)',
                    maxHeight: 'calc(100vh - 120px)',
                }}
            >
                <Grid numItems={10} className="gap-x-6 h-fit">
                    <Col numColSpan={2} />
                    <Col numColSpan={6}>
                        {msgList().length === 0 ? (
                            <Flex
                                flexDirection="col"
                                justifyContent={
                                    msgList().length === 0 ? 'start' : 'end'
                                }
                                className="space-y-4 h-full"
                            >
                                <Flex
                                    flexDirection="col"
                                    className="gap-12 pt-40 h-full w-full"
                                >
                                    <Flex flexDirection="col" className="h-fit">
                                        <img
                                            src={AssistantImage}
                                            alt="K"
                                            className="w-[200px]"
                                        />
                                        <Title className="text-gray-400">
                                            {assistantIdx !== 0
                                                ? 'How can I help you'
                                                : 'Choose your Assistant'}
                                        </Title>
                                    </Flex>
                                    <Flex
                                        flexDirection="col"
                                        justifyContent={
                                            assistantIdx === 0 ? 'start' : 'end'
                                        }
                                        className="h-full w-full"
                                    >
                                        {assistantIdx === 0 ? (
                                            <Grid
                                                numItems={2}
                                                className="gap-4"
                                            >
                                                {assisstantDetails.map(
                                                    (item) => (
                                                        <Flex
                                                            className="gap-6 px-6 py-5 rounded-xl cursor-pointer shadow-sm hover:shadow-lg bg-white"
                                                            onClick={() => {
                                                                setAssistantIdx(
                                                                    item.idx
                                                                )
                                                                // setAssistantSelected(true)
                                                            }}
                                                        >
                                                            <Flex
                                                                flexDirection="col"
                                                                alignItems="start"
                                                                className="gap-2"
                                                            >
                                                                <Title>
                                                                    {item.title}
                                                                </Title>
                                                                <Text>
                                                                    {
                                                                        item.description
                                                                    }
                                                                </Text>
                                                            </Flex>
                                                            <ChevronRightIcon className="w-6 text-gray-500" />
                                                        </Flex>
                                                    )
                                                )}
                                            </Grid>
                                        ) : (
                                            <Grid
                                                numItems={2}
                                                className="gap-4 w-full"
                                            >
                                                {examplePropmts.map((item) => (
                                                    <Flex
                                                        className="gap-6 px-4 py-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-200"
                                                        onClick={() => {
                                                            setContent(item)
                                                            sendNow()
                                                        }}
                                                    >
                                                        <Flex
                                                            flexDirection="col"
                                                            alignItems="start"
                                                            className="gap-2"
                                                        >
                                                            <Text className="text-gray-600">
                                                                {item}
                                                            </Text>
                                                        </Flex>
                                                    </Flex>
                                                ))}
                                            </Grid>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        ) : (
                            <Flex
                                flexDirection="col"
                                justifyContent="end"
                                className="space-y-4 h-full"
                            >
                                {msgList().map((msg) => {
                                    return (
                                        <Flex
                                            flexDirection="col"
                                            alignItems={
                                                msg.role === 'user'
                                                    ? 'end'
                                                    : 'start'
                                            }
                                        >
                                            <Card
                                                className={
                                                    msg.role === 'user'
                                                        ? 'w-fit bg-blue-50 !shadow-lg !rounded-2xl ring-blue-100 relative'
                                                        : 'w-fit bg-white !shadow-lg !rounded-2xl ring-gray-200 relative'
                                                }
                                            >
                                                {user && msg.role === 'user' ? (
                                                    <img
                                                        className="absolute h-10 w-10 -right-16 bottom-0 rounded-full !shadow-lg bg-gray-50 border border-gray-200"
                                                        src={user.picture}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <Flex
                                                        justifyContent="center"
                                                        className="absolute h-10 w-10 -left-16 bottom-0 rounded-full !shadow-lg bg-gray-50 border border-gray-200"
                                                    >
                                                        K
                                                    </Flex>
                                                )}

                                                <Text className="!font-extrabold !text-base text-gray-900 mb-4">
                                                    {msg.role === 'user'
                                                        ? 'You'
                                                        : 'Kaytu Assistant'}
                                                </Text>
                                                <MarkdownPreview
                                                    source={msg.content}
                                                    className="!bg-transparent"
                                                    wrapperElement={{
                                                        'data-color-mode':
                                                            'light',
                                                    }}
                                                    rehypeRewrite={(
                                                        node,
                                                        index,
                                                        parent
                                                    ) => {
                                                        if (
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-ignore
                                                            node.tagName ===
                                                                'a' &&
                                                            parent &&
                                                            /^h(1|2|3|4|5|6)/.test(
                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                // @ts-ignore
                                                                parent.tagName
                                                            )
                                                        ) {
                                                            // eslint-disable-next-line no-param-reassign
                                                            parent.children =
                                                                parent.children.slice(
                                                                    1
                                                                )
                                                        }
                                                    }}
                                                />
                                            </Card>
                                            {msg.role !== 'user' && (
                                                <Flex
                                                    justifyContent="start"
                                                    className="mt-6 gap-4"
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        icon={ArrowPathIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Retry
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        icon={HandThumbUpIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Like
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        icon={HandThumbDownIcon}
                                                        className="shadow-none border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
                                                    >
                                                        Dislike
                                                    </Button>
                                                </Flex>
                                            )}
                                        </Flex>
                                    )
                                })}
                            </Flex>
                        )}

                        {/* <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={(el) => {
                            ref.current = el
                        }}
                    /> */}
                    </Col>
                    <Col numColSpan={2} />
                </Grid>
            </div>

            <Grid numItems={10} className="gap-x-6 mt-4 w-full">
                <Col numColSpan={2} />
                <Col numColSpan={6}>
                    {assistantIdx !== 0 && (
                        <Flex
                            flexDirection="row"
                            justifyContent="between"
                            className="gap-4 w-full"
                        >
                            <TextInput
                                value={content}
                                placeholder="Message Kaytu Assistance..."
                                disabled={
                                    isRunning || (isExecuted && isLoading)
                                }
                                onValueChange={setContent}
                                className="w-full"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (
                                            !isRunning &&
                                            !(isExecuted && isLoading)
                                        ) {
                                            sendNow()
                                        }
                                    }
                                }}
                            />
                            <Button
                                loading={isRunning || (isExecuted && isLoading)}
                                onClick={sendNow}
                                icon={ChevronRightIcon}
                                iconPosition="right"
                            >
                                Send Message
                            </Button>
                        </Flex>
                    )}
                </Col>
                <Col numColSpan={2} />
            </Grid>

            {errorHandlingWithErrorMessage(refresh, toErrorMessage(err))}
        </Flex>
    )
}
