import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Divider,
    Flex,
    List,
    ListItem,
    NumberInput,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import {
    useMetadataApiV1MetadataCreate,
    useMetadataApiV1MetadataDetail,
} from '../../../api/metadata.gen'
import Spinner from '../../../components/Spinner'
import { getErrorMessage } from '../../../types/apierror'
import { isDemoAtom, previewAtom } from '../../../store'

interface IMetric {
    title: string
    metricId: string
    min: number
    max: number
}

function Metric({ title, metricId, min, max }: IMetric) {
    const [value, setValue] = useState<string>('')
    const [timer, setTimer] = useState<any>()

    const {
        response,
        isLoading,
        isExecuted,
        sendNow: refresh,
    } = useMetadataApiV1MetadataDetail(metricId)

    const {
        isLoading: setIsLoading,
        isExecuted: setIsExecuted,
        error,
        sendNow: sendSet,
    } = useMetadataApiV1MetadataCreate(
        {
            key: metricId,
            value,
        },
        {},
        false
    )

    useEffect(() => {
        if (isExecuted && !isLoading) {
            setValue(response?.value || '')
        }
    }, [isLoading])

    useEffect(() => {
        if (setIsExecuted && !setIsLoading) {
            refresh()
        }
    }, [setIsLoading])

    useEffect(() => {
        try {
            const valueInt = parseInt(value, 10)
            if (valueInt < min || valueInt > max) {
                return
            }
        } catch (e) {
            return
        }

        if (value === '' || value === response?.value) {
            return
        }

        if (timer !== undefined && timer !== null) {
            clearTimeout(timer)
        }

        const t = setTimeout(() => {
            sendSet()
        }, 1000)

        setTimer(t)
    }, [value])

    return (
        <Flex flexDirection="row" className="mb-4">
            <Flex justifyContent="start" className="truncate space-x-4 ">
                <div className="truncate">
                    <Text className="truncate text-sm">{title}:</Text>
                </div>
            </Flex>

            <NumberInput
                value={value}
                min={min}
                max={max}
                onValueChange={(e) => setValue(String(e))}
                error={error !== undefined}
                errorMessage={getErrorMessage(error)}
                icon={isLoading ? Spinner : undefined}
                disabled={isLoading}
            />
        </Flex>
    )
}

export default function SettingsCustomization() {
    const [preview, setPreview] = useAtom(previewAtom)
    const [isDemo, setIsDemo] = useAtom(isDemoAtom)
    const [selectedMode, setSelectedMode] = useState(isDemo ? 1 : 0)
    useEffect(() => {
        switch (selectedMode) {
            case 0:
                localStorage.demoMode = 'false'
                setIsDemo(false)
                break
            case 1:
                localStorage.demoMode = 'true'
                setIsDemo(true)
                break
            default:
                localStorage.demoMode = 'false'
                setIsDemo(false)
        }
    }, [selectedMode])

    return (
        <Card key="summary" className="">
            <Title className="font-semibold">Customization</Title>
            <Divider />

            <Title className="font-semibold">
                Jobs interval configurations
            </Title>

            <Flex flexDirection="col" className="mt-4">
                <Metric
                    metricId="describe_job_interval"
                    title="Fast Discovery Interval (Hours)"
                    min={8}
                    max={120}
                />
                <Metric
                    metricId="full_discovery_job_interval"
                    title="Full Discovery Interval (Hours)"
                    min={24}
                    max={120}
                />
                <Metric
                    metricId="cost_discovery_job_interval"
                    title="Spend Discovery Interval (Hours)"
                    min={24}
                    max={120}
                />
                <Metric
                    metricId="insight_job_interval"
                    title="Insight Job Interval (Hours)"
                    min={4}
                    max={120}
                />
                <Metric
                    metricId="metrics_job_interval"
                    title="Metrics Job Interval (Hours)"
                    min={4}
                    max={120}
                />
                <Metric
                    metricId="compliance_job_interval"
                    title="Compliance Job Interval (Hours)"
                    min={24}
                    max={120}
                />
            </Flex>

            <Title className="font-semibold mt-8">App configurations</Title>

            {/* <Flex
                flexDirection="row"
                justifyContent="between"
                className="w-full mt-2"
            >
                <Text className="font-normal">Demo Mode</Text>
                <TabGroup
                    index={selectedMode}
                    onIndexChange={setSelectedMode}
                    className="w-fit"
                >
                    <TabList className="border border-gray-200" variant="solid">
                        <Tab>App mode</Tab>
                        <Tab>Demo mode</Tab>
                    </TabList>
                </TabGroup>
            </Flex> */}
            <Flex
                flexDirection="row"
                justifyContent="between"
                className="w-full mt-4"
            >
                <Text className="font-normal">Show preview features</Text>
                <TabGroup
                    index={preview === 'true' ? 0 : 1}
                    onIndexChange={(idx) =>
                        setPreview(idx === 0 ? 'true' : 'false')
                    }
                    className="w-fit"
                >
                    <TabList className="border border-gray-200" variant="solid">
                        <Tab>On</Tab>
                        <Tab>Off</Tab>
                    </TabList>
                </TabGroup>
            </Flex>
        </Card>
    )
}
