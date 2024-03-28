import { Badge, Card, Flex, Icon, Subtitle, Text, Title } from '@tremor/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { numericDisplay } from '../../../utilities/numericDisplay'
import { AWSAzureIcon, AWSIcon, AzureIcon } from '../../../icons/icons'
import { SourceType } from '../../../api/api'
import { searchAtom } from '../../../utilities/urlstate'

interface IConnectorCard {
    connector: string | undefined
    title: string | undefined
    status: string | undefined
    count: number | string | undefined
    description: string | undefined
}

export const getConnectorIcon = (
    connector: string | SourceType[] | SourceType | undefined,
    className = ''
) => {
    if (connector !== undefined && connector?.length >= 2) {
        return (
            <img
                src={AWSAzureIcon}
                alt="connector"
                className="min-w-[36px] w-9 h-9 rounded-full"
            />
        )
    }
    return (
        <Flex className={`w-9 h-9 gap-1 ${className}`}>
            {typeof connector === 'string' ? (
                <img
                    src={connector === 'Azure' ? AzureIcon : AWSIcon}
                    alt="connector"
                    className="min-w-[36px] w-9 h-9 rounded-full"
                />
            ) : (
                connector?.map((c) => (
                    <img
                        src={c === 'Azure' ? AzureIcon : AWSIcon}
                        alt="connector"
                        className="min-w-[36px] w-9 h-9 rounded-full"
                    />
                ))
            )}
        </Flex>
    )
}

const getBadgeColor = (status: string | undefined) => {
    if (status === 'enabled') {
        return 'emerald'
    }
    return 'rose'
}

export default function ConnectorCard({
    connector,
    title,
    status,
    count,
    description,
}: IConnectorCard) {
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)

    return (
        <Card
            key={connector}
            className="cursor-pointer"
            onClick={() => navigate(`${connector}?${searchParams}`)}
        >
            <Flex flexDirection="row" className="mb-3">
                {getConnectorIcon(connector)}
                <Badge color={getBadgeColor(status)}>
                    {status === 'enabled' ? (
                        <Text color="emerald">Active</Text>
                    ) : (
                        <Text color="rose">InActive</Text>
                    )}
                </Badge>
            </Flex>
            <Flex flexDirection="row" className="mb-1">
                <Title className="font-semibold">{title}</Title>
                <Title className="font-semibold">{numericDisplay(count)}</Title>
            </Flex>
            <Subtitle>{description}</Subtitle>
            <Flex flexDirection="row" justifyContent="end">
                <Icon color="blue" icon={ChevronRightIcon} />
            </Flex>
        </Card>
    )
}
