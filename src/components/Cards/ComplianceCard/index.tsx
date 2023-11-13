import {
    Badge,
    Card,
    CategoryBar,
    Flex,
    Icon,
    Text,
    Title,
} from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { getConnectorIcon } from '../ConnectorCard'
import { numberDisplay } from '../../../utilities/numericDisplay'

interface IComplianceCard {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
}

export const benchmarkChecks = (
    ben:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
) => {
    const critical = ben?.checks?.criticalCount || 0
    const high = ben?.checks?.highCount || 0
    const medium = ben?.checks?.mediumCount || 0
    const low = ben?.checks?.lowCount || 0
    const passed = ben?.checks?.passedCount || 0
    const unknown = ben?.checks?.unknownCount || 0

    const total = critical + high + medium + low + passed + unknown
    const failed = critical + high + medium + low

    return {
        critical,
        high,
        medium,
        low,
        passed,
        unknown,
        total,
        failed,
    }
}

export default function ComplianceCard({ benchmark }: IComplianceCard) {
    const navigate = useNavigate()

    const connector = () => {
        if (benchmark?.tags?.plugin) {
            if (benchmark?.tags?.plugin[0] === 'azure') {
                return 'Azure'
            }
            return 'AWS'
        }
        return undefined
    }

    return (
        <Card
            key={benchmark?.id}
            className="cursor-pointer"
            onClick={() =>
                navigate(
                    `${benchmark?.id}${
                        benchmarkChecks(benchmark).total
                            ? ''
                            : '/details#assignments'
                    }`
                )
            }
        >
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col">
                    <Flex className="mb-3">
                        {getConnectorIcon(connector())}
                    </Flex>
                    <Title className="w-full truncate mb-3">
                        {benchmark?.title}
                    </Title>
                    <Flex
                        className={`mb-3 ${
                            benchmarkChecks(benchmark).total ? '' : 'hidden'
                        }`}
                    >
                        <Text>Security score:</Text>
                        <Text className="font-semibold">
                            {(
                                (benchmarkChecks(benchmark).passed /
                                    benchmarkChecks(benchmark).total || 0) * 100
                            ).toFixed(2)}{' '}
                            %
                        </Text>
                    </Flex>
                    <CategoryBar
                        className="w-full mb-2"
                        values={[
                            (benchmarkChecks(benchmark).critical /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).high /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).medium /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).low /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            (benchmarkChecks(benchmark).passed /
                                benchmarkChecks(benchmark).total) *
                                100 || 0,
                            benchmarkChecks(benchmark).critical +
                                benchmarkChecks(benchmark).high +
                                benchmarkChecks(benchmark).medium +
                                benchmarkChecks(benchmark).low +
                                benchmarkChecks(benchmark).passed >
                            0
                                ? (benchmarkChecks(benchmark).unknown /
                                      benchmarkChecks(benchmark).total) *
                                      100 || 0
                                : 100,
                        ]}
                        markerValue={
                            ((benchmarkChecks(benchmark).critical +
                                benchmarkChecks(benchmark).high +
                                benchmarkChecks(benchmark).medium +
                                benchmarkChecks(benchmark).low) /
                                benchmarkChecks(benchmark).total) *
                                100 || 1
                        }
                        showLabels={false}
                        colors={[
                            'rose',
                            'orange',
                            'amber',
                            'yellow',
                            'emerald',
                            'slate',
                        ]}
                    />
                    <Flex
                        className={
                            benchmarkChecks(benchmark).total ? '' : 'hidden'
                        }
                    >
                        <Text className="text-xs">{`${numberDisplay(
                            benchmarkChecks(benchmark).failed,
                            0
                        )} of ${numberDisplay(
                            benchmarkChecks(benchmark).total,
                            0
                        )} checks failed`}</Text>
                        {!!(
                            benchmarkChecks(benchmark).failed /
                            benchmarkChecks(benchmark).total
                        ) && (
                            <Text className="text-xs font-semibold">{`${Math.round(
                                (benchmarkChecks(benchmark).failed /
                                    benchmarkChecks(benchmark).total) *
                                    100
                            )}% failed`}</Text>
                        )}
                    </Flex>
                    <Flex justifyContent="start" className="mt-6 gap-2">
                        {benchmark?.tags?.category?.map((cat) => (
                            <Badge color="slate">{cat}</Badge>
                        ))}
                        {benchmark?.tags?.kaytu_category?.map((cat) => (
                            <Badge color="emerald" size="xs">
                                {cat}
                            </Badge>
                        ))}
                        {!!benchmark?.tags?.cis && (
                            <Badge color="sky">CIS</Badge>
                        )}
                        {!!benchmark?.tags?.hipaa && (
                            <Badge color="blue">Hipaa</Badge>
                        )}
                    </Flex>
                </Flex>
                <Flex justifyContent="end">
                    <Text
                        color="blue"
                        className={`${
                            benchmarkChecks(benchmark).total ? 'hidden' : ''
                        }`}
                    >
                        Assign connection
                    </Text>
                    <Icon
                        icon={ChevronRightIcon}
                        color="blue"
                        size="md"
                        className="p-0"
                    />
                </Flex>
            </Flex>
        </Card>
    )
}
