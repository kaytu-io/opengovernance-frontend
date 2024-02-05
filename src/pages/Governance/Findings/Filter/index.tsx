import { Button, Card, Flex, Icon, Text } from '@tremor/react'
import { Popover, Transition } from '@headlessui/react'
import {
    CalendarIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    CloudIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Provider from './Provider'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import ConformanceStatus from './ConformanceStatus'
import { useComplianceApiV1FindingsFiltersCreate } from '../../../../api/compliance.gen'
import Others from './Others'
import FindingLifecycle from './FindingLifecycle'
import { compareArrays } from '../../../../components/Layout/Header/Filter'
import ConditionDropdown from './ConditionDropdown'
import {
    CloudConnect,
    Compliance,
    Control,
    Id,
    Lifecycle,
    Resources,
    SeverityIcon,
} from '../../../../icons/icons'
import Severity from './Severity'
import Datepicker, { IDate } from './Datepicker'
import {
    DateRange,
    defaultFindingsTime,
    useURLParam,
} from '../../../../utilities/urlstate'
import { renderDateText } from '../../../../components/Layout/Header/DatePicker'

interface IFilters {
    onApply: (obj: {
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
        activeTimeRange: DateRange | undefined
    }) => void
    isFinding: boolean
    type: 'findings' | 'resources' | 'controls' | 'accounts' | 'events'
}

export default function Filter({ onApply, isFinding, type }: IFilters) {
    const defConnector = SourceType.Nil
    const [connector, setConnector] = useState<SourceType>(defConnector)

    const defConformanceStatus = [
        GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus.ConformanceStatusFailed,
    ]
    const [conformanceStatus, setConformanceStatus] = useState<
        | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
        | undefined
    >(defConformanceStatus)

    const defLifecycle = [true, false]
    const [lifecycle, setLifecycle] = useState<boolean[]>(defLifecycle)

    const defSeverity = [
        TypesFindingSeverity.FindingSeverityCritical,
        TypesFindingSeverity.FindingSeverityHigh,
        TypesFindingSeverity.FindingSeverityMedium,
        TypesFindingSeverity.FindingSeverityLow,
        TypesFindingSeverity.FindingSeverityNone,
    ]
    const [severity, setSeverity] = useState<
        TypesFindingSeverity[] | undefined
    >(defSeverity)
    const [severityCon, setSeverityCon] = useState('is')

    const [connectionID, setConnectionID] = useState<string[] | undefined>([])
    const [connectionCon, setConnectionCon] = useState('is')
    const [controlID, setControlID] = useState<string[] | undefined>([])
    const [controlCon, setControlCon] = useState('is')
    const [benchmarkID, setBenchmarkID] = useState<string[] | undefined>([])
    const [benchmarkCon, setBenchmarkCon] = useState('is')
    const [resourceTypeID, setResourceTypeID] = useState<string[] | undefined>(
        []
    )
    const [resourceCon, setResourceCon] = useState('is')
    const [dateCon, setDateCon] = useState('isBetween')
    const [activeTimeRange, setActiveTimeRange] = useURLParam<IDate>(
        'dateRange',
        defaultFindingsTime,
        (v) => {
            return `${v.start.format('YYYY-MM-DD HH:mm:ss')} - ${v.end.format(
                'YYYY-MM-DD HH:mm:ss'
            )}`
        },
        (v) => {
            const arr = v
                .replaceAll('+', ' ')
                .split(' - ')
                .map((m) => dayjs(m))
            return {
                start: arr[0],
                end: arr[1],
            }
        }
    )
    const [selectedFilters, setSelectedFilters] = useState<string[]>([
        'conformance_status',
    ])

    useEffect(() => {
        onApply({
            connector,
            conformanceStatus,
            severity,
            connectionID,
            controlID,
            benchmarkID,
            resourceTypeID,
            lifecycle,
            activeTimeRange: selectedFilters.includes('date')
                ? activeTimeRange
                : undefined,
        })
    }, [
        connector,
        conformanceStatus,
        severity,
        connectionID,
        controlID,
        benchmarkID,
        resourceTypeID,
        lifecycle,
        activeTimeRange,
    ])

    const { response: filters } = useComplianceApiV1FindingsFiltersCreate({})

    const filterOptions = [
        {
            id: 'conformance_status',
            name: 'Conformance Status',
            icon: CheckCircleIcon,
            component: (
                <ConformanceStatus
                    value={conformanceStatus}
                    defaultValue={defConformanceStatus}
                    onChange={(c) => setConformanceStatus(c)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: conformanceStatus,
            defaultValue: defConformanceStatus,
            onDelete: undefined,
            findingOnly: true,
        },
        {
            id: 'provider',
            name: 'Provider',
            icon: CloudConnect,
            component: (
                <Provider
                    value={connector}
                    defaultValue={defConnector}
                    onChange={(p) => setConnector(p)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => undefined,
            value: [connector],
            defaultValue: [defConnector],
            onDelete: () => setConnector(defConnector),
            findingOnly: false,
        },
        {
            id: 'lifecycle',
            name: 'Lifecycle',
            icon: Lifecycle,
            component: (
                <FindingLifecycle
                    value={lifecycle}
                    defaultValue={defLifecycle}
                    onChange={(l) => setLifecycle(l)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => console.log(c),
            value: lifecycle,
            defaultValue: defLifecycle,
            onDelete: () => setLifecycle(defLifecycle),
            findingOnly: true,
        },
        {
            id: 'severity',
            name: 'Severity',
            icon: SeverityIcon,
            component: (
                <Severity
                    value={severity}
                    defaultValue={defSeverity}
                    condition={severityCon}
                    onChange={(s) => setSeverity(s)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setSeverityCon(c),
            value: severity,
            defaultValue: defSeverity,
            onDelete: () => setSeverity(defSeverity),
            findingOnly: true,
        },
        {
            id: 'connection',
            name: 'Cloud Account',
            icon: Id,
            component: (
                <Others
                    value={connectionID}
                    defaultValue={[]}
                    data={filters}
                    condition={connectionCon}
                    type="connectionID"
                    onChange={(o) => setConnectionID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setConnectionCon(c),
            value: connectionID,
            defaultValue: [],
            onDelete: () => setConnectionID([]),
            findingOnly: false,
        },
        {
            id: 'control',
            name: 'Control',
            icon: Control,
            component: (
                <Others
                    value={controlID}
                    defaultValue={[]}
                    data={filters}
                    condition={controlCon}
                    type="controlID"
                    onChange={(o) => setControlID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setControlCon(c),
            value: controlID,
            defaultValue: [],
            onDelete: () => setControlID([]),
            findingOnly: true,
        },
        {
            id: 'benchmark',
            name: 'Benchmark',
            icon: Compliance,
            component: (
                <Others
                    value={benchmarkID}
                    defaultValue={[]}
                    data={filters}
                    condition={benchmarkCon}
                    type="benchmarkID"
                    onChange={(o) => setBenchmarkID(o)}
                />
            ),
            conditions: ['is'],
            setCondition: (c: string) => setBenchmarkCon(c),
            value: benchmarkID,
            defaultValue: [],
            onDelete: () => setBenchmarkID([]),
            findingOnly: false,
        },
        {
            id: 'resource',
            name: 'Resource Type',
            icon: Resources,
            component: (
                <Others
                    value={resourceTypeID}
                    defaultValue={[]}
                    data={filters}
                    condition={resourceCon}
                    type="resourceTypeID"
                    onChange={(o) => setResourceTypeID(o)}
                />
            ),
            conditions: ['is', 'isNot'],
            setCondition: (c: string) => setResourceCon(c),
            value: resourceTypeID,
            defaultValue: [],
            onDelete: () => setResourceTypeID([]),
            findingOnly: true,
        },
        {
            id: 'date',
            name: type === 'events' ? 'Audit Period' : 'Last Evaluated',
            icon: CalendarIcon,
            component: <Datepicker condition={dateCon} />,
            conditions: ['isBetween', 'relative'],
            setCondition: (c: string) => setDateCon(c),
            value: activeTimeRange,
            defaultValue: { start: dayjs.utc(), end: dayjs.utc() },
            onDelete: () =>
                setActiveTimeRange({ start: dayjs.utc(), end: dayjs.utc() }),
            findingOnly: true,
        },
    ]

    const renderFilters = selectedFilters.map((sf) => {
        const f = filterOptions.find((o) => o.id === sf)
        return (
            (isFinding || isFinding === f?.findingOnly) && (
                <Popover className="relative border-0">
                    <Popover.Button
                        id={f?.id}
                        className={`border ${
                            f?.id !== 'date' &&
                            compareArrays(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                f?.value?.sort(),
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                f?.defaultValue?.sort()
                            )
                                ? 'border-gray-200 bg-white'
                                : 'border-kaytu-500 text-kaytu-500 bg-kaytu-50'
                        } py-1.5 px-2 rounded-md`}
                    >
                        <Flex className="w-fit">
                            <Icon
                                icon={f?.icon || CloudIcon}
                                className="w-3 p-0 mr-3 text-inherit"
                            />
                            <Text className="text-inherit whitespace-nowrap">
                                {`${f?.name}${
                                    // eslint-disable-next-line no-nested-ternary
                                    f?.id === 'date'
                                        ? ` ${renderDateText(
                                              activeTimeRange.start,
                                              activeTimeRange.end
                                          )}`
                                        : compareArrays(
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-ignore
                                              f?.value?.sort(),
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-ignore
                                              f?.defaultValue?.sort()
                                          )
                                        ? ''
                                        : `${
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-ignore
                                              f?.value && f.value.length < 2
                                                  ? `: ${f.value}`
                                                  : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    ` (${f?.value?.length})`
                                          }`
                                }`}
                            </Text>
                            <ChevronDownIcon className="ml-1 w-3 text-inherit" />
                        </Flex>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-50 top-full left-0"
                        >
                            <Card className="mt-2 p-4 min-w-[256px] w-fit">
                                <Flex className="mb-3">
                                    <Flex className="w-fit gap-1.5">
                                        <Text className="font-semibold">
                                            {f?.name}
                                        </Text>
                                        <ConditionDropdown
                                            onChange={(c) =>
                                                f?.setCondition
                                                    ? f?.setCondition(c)
                                                    : undefined
                                            }
                                            conditions={f?.conditions}
                                            isDate={f?.id === 'date'}
                                        />
                                    </Flex>
                                    {f?.onDelete && (
                                        <div className="group relative">
                                            <TrashIcon
                                                onClick={() => {
                                                    f?.onDelete()
                                                    setSelectedFilters(
                                                        (prevState) => {
                                                            return prevState.filter(
                                                                (s) =>
                                                                    s !== f?.id
                                                            )
                                                        }
                                                    )
                                                }}
                                                className="w-4 cursor-pointer hover:text-kaytu-500"
                                            />
                                            <Card className="absolute w-fit z-40 -top-2 left-full ml-2 scale-0 transition-all p-2 group-hover:scale-100">
                                                <Text className="whitespace-nowrap">
                                                    Remove filter
                                                </Text>
                                            </Card>
                                        </div>
                                    )}
                                </Flex>
                                {f?.component}
                            </Card>
                        </Popover.Panel>
                    </Transition>
                </Popover>
            )
        )
    })

    return (
        <Flex justifyContent="start" className="mt-4 gap-3 flex-wrap z-10">
            {renderFilters}
            {filterOptions.filter((f) => !selectedFilters.includes(f.id))
                .length > 0 && (
                <Flex className="w-fit pl-3 border-l border-l-gray-200 h-full">
                    <Popover className="relative border-0">
                        <Popover.Button>
                            <Button
                                variant="light"
                                icon={PlusIcon}
                                className="pt-1"
                            >
                                Add Filter
                            </Button>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-50 top-full left-0">
                                <Card className="mt-2 p-4 w-64">
                                    <Flex
                                        flexDirection="col"
                                        justifyContent="start"
                                        alignItems="start"
                                        className="gap-1.5 max-h-[200px] overflow-y-scroll no-scroll max-w-full"
                                    >
                                        {filterOptions
                                            .filter(
                                                (f) =>
                                                    !selectedFilters.includes(
                                                        f.id
                                                    ) &&
                                                    (isFinding ||
                                                        isFinding ===
                                                            f?.findingOnly)
                                            )
                                            .map((f) => (
                                                <Button
                                                    icon={f.icon}
                                                    color="slate"
                                                    variant="light"
                                                    className="w-full pl-1 flex justify-start"
                                                    onClick={() => {
                                                        setSelectedFilters([
                                                            ...selectedFilters,
                                                            f.id,
                                                        ])
                                                    }}
                                                >
                                                    {f.name}
                                                </Button>
                                            ))}
                                    </Flex>
                                </Card>
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </Flex>
            )}
        </Flex>
    )
}
