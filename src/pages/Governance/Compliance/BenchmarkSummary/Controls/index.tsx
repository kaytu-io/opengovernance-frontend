import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Col,
    Flex,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import {
    BookOpenIcon,
    CheckCircleIcon,
    CommandLineIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../../../api/compliance.gen'
import Spinner from '../../../../../components/Spinner'
import { numberDisplay } from '../../../../../utilities/numericDisplay'

interface IPolicies {
    id: string | undefined
}

export const severityBadge = (severity: any) => {
    const style = {
        color: '#fff',
        borderRadius: '8px',
        width: '64px',
    }
    if (severity) {
        if (severity === 'critical') {
            return (
                <Badge style={{ backgroundColor: '#6E120B', ...style }}>
                    Critical
                </Badge>
            )
        }
        if (severity === 'high') {
            return (
                <Badge style={{ backgroundColor: '#CA2B1D', ...style }}>
                    High
                </Badge>
            )
        }
        if (severity === 'medium') {
            return (
                <Badge style={{ backgroundColor: '#EE9235', ...style }}>
                    Medium
                </Badge>
            )
        }
        if (severity === 'low') {
            return (
                <Badge style={{ backgroundColor: '#F4C744', ...style }}>
                    Low
                </Badge>
            )
        }
        if (severity === 'none') {
            return (
                <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>
                    None
                </Badge>
            )
        }
        return (
            <Badge style={{ backgroundColor: '#54B584', ...style }}>
                Passed
            </Badge>
        )
    }
    return <Badge style={{ backgroundColor: '#9BA2AE', ...style }}>None</Badge>
}

export const statusBadge = (status: any) => {
    if (status === 'ok') {
        return (
            <Flex className="w-fit gap-1.5">
                <CheckCircleIcon className="h-4 text-emerald-500" />
                <Text>Passed</Text>
            </Flex>
        )
    }
    return (
        <Flex className="w-fit gap-1.5">
            <XCircleIcon className="h-4 text-rose-600" />
            <Text>Failed</Text>
        </Flex>
    )
}

export const treeRows = (json: any) => {
    let arr: any = []
    if (json) {
        if (json.control !== null && json.control !== undefined) {
            for (let i = 0; i < json.control.length; i += 1) {
                let obj = {}
                obj = {
                    parentName: json.benchmark.title,
                    ...json.control[i].control,
                    ...json.control[i],
                }
                arr.push(obj)
            }
        }
        if (json.children !== null && json.children !== undefined) {
            for (let i = 0; i < json.children.length; i += 1) {
                const res = treeRows(json.children[i])
                arr = arr.concat(res)
            }
        }
    }

    return arr
}

export const groupBy = (input: any[], key: string) => {
    return input.reduce((acc, currentValue) => {
        const groupKey = currentValue[key]
        if (!acc[groupKey]) {
            acc[groupKey] = []
        }
        acc[groupKey].push(currentValue)
        return acc
    }, {})
}

export default function Controls({ id }: IPolicies) {
    const { response: controls, isLoading } =
        useComplianceApiV1BenchmarksControlsDetail(String(id))
    const navigate = useNavigate()
    console.log(groupBy(treeRows(controls), 'parentName'))

    return (
        <Flex flexDirection="col" className="gap-4">
            {isLoading ? (
                <Spinner className="mt-20" />
            ) : (
                Object.entries(groupBy(treeRows(controls), 'parentName'))?.map(
                    ([name, value]: any[]) => (
                        <Card>
                            <Accordion
                                defaultOpen
                                className="bg-transparent border-0"
                            >
                                <AccordionHeader className="pl-0 pr-0.5 py-2 w-full bg-transparent">
                                    <Flex>
                                        <Flex>
                                            <Title className="font-semibold">
                                                {name}
                                            </Title>
                                            <Flex
                                                justifyContent="start"
                                                className="gap-2"
                                                style={{ width: '200px' }}
                                            >
                                                {value?.filter(
                                                    (c: any) => c.passed
                                                ).length === value?.length ? (
                                                    <CheckCircleIcon className="w-5 text-emerald-500" />
                                                ) : (
                                                    <XCircleIcon className="w-5 text-rose-600" />
                                                )}
                                                <Text className="font-semibold">{`Passed controls: ${numberDisplay(
                                                    value?.filter(
                                                        (c: any) => c.passed
                                                    ).length,
                                                    0
                                                )}/${numberDisplay(
                                                    value?.length,
                                                    0
                                                )} (${Math.floor(
                                                    // eslint-disable-next-line no-unsafe-optional-chaining
                                                    (value?.filter(
                                                        (c: any) => c.passed
                                                    ).length /
                                                        (value?.length || 0)) *
                                                        100
                                                )}%)`}</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </AccordionHeader>
                                <AccordionBody className="p-0 pt-4">
                                    <Table className="max-w-full">
                                        <TableHead className="max-w-full">
                                            <TableRow className="max-w-full">
                                                <TableHeaderCell className="w-24">
                                                    Control
                                                </TableHeaderCell>
                                                <TableHeaderCell>
                                                    Title
                                                </TableHeaderCell>
                                                <TableHeaderCell className="w-40">
                                                    Remediation
                                                </TableHeaderCell>
                                                <TableHeaderCell className="w-48">
                                                    Passed resources
                                                </TableHeaderCell>
                                                <TableHeaderCell className="w-5" />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="max-w-full">
                                            {value.map((v: any, i: number) => (
                                                <TableRow
                                                    className="max-w-full cursor-pointer hover:bg-kaytu-50"
                                                    key={v?.id}
                                                    onClick={() =>
                                                        navigate(String(v?.id))
                                                    }
                                                >
                                                    <TableCell className="w-24 min-w-[96px]">{`${name.substring(
                                                        0,
                                                        name.indexOf(' ')
                                                    )}.${i + 1}`}</TableCell>
                                                    <TableCell>
                                                        <Grid
                                                            numItems={10}
                                                            className="w-full"
                                                        >
                                                            {severityBadge(
                                                                v?.severity
                                                            )}
                                                            <Col numColSpan={9}>
                                                                <Text className="truncate">
                                                                    {v?.title}
                                                                </Text>
                                                            </Col>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Flex
                                                            alignItems="start"
                                                            className="gap-1.5"
                                                        >
                                                            {v?.cliRemediation &&
                                                                v
                                                                    ?.cliRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <CommandLineIcon className="text-kaytu-500 w-4" />
                                                                )}
                                                            {v?.manualRemediation &&
                                                                v
                                                                    ?.manualRemediation
                                                                    .length >
                                                                    0 && (
                                                                    <BookOpenIcon className="text-kaytu-500 w-4" />
                                                                )}
                                                        </Flex>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Flex
                                                            justifyContent="start"
                                                            className="gap-2"
                                                        >
                                                            {(v?.totalResourcesCount ||
                                                                0) -
                                                                (v?.failedResourcesCount ||
                                                                    0) ===
                                                            (v?.totalResourcesCount ||
                                                                0) ? (
                                                                <CheckCircleIcon className="w-5 text-emerald-500" />
                                                            ) : (
                                                                <XCircleIcon className="w-5 text-rose-600" />
                                                            )}
                                                            {`${numberDisplay(
                                                                (v?.totalResourcesCount ||
                                                                    0) -
                                                                    (v?.failedResourcesCount ||
                                                                        0),
                                                                0
                                                            )}/${numberDisplay(
                                                                v?.totalResourcesCount ||
                                                                    0,
                                                                0
                                                            )} (${Math.floor(
                                                                (((v?.totalResourcesCount ||
                                                                    0) -
                                                                    (v?.failedResourcesCount ||
                                                                        0)) /
                                                                    (v?.totalResourcesCount ||
                                                                        1)) *
                                                                    100
                                                            )}%)`}
                                                        </Flex>
                                                    </TableCell>
                                                    <TableCell>
                                                        <ChevronRightIcon className="h-5 text-kaytu-500" />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionBody>
                            </Accordion>
                        </Card>
                    )
                )
            )}
        </Flex>
    )
}
