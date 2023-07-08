import { Bold, Button, Divider, Flex, Text } from '@tremor/react'

interface IStep {
    onNext: any
    onPrevious: any
    data: any
}

export default function FinalStep({ onNext, onPrevious, data }: IStep) {
    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">AWS Account information</Bold>
                <Text className="mb-6">
                    Check everything before submit your organization
                </Text>
                <Flex flexDirection="row">
                    <Text>Access Key</Text>
                    <Text className="text-black">{data.accessKey}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Secret Key</Text>
                    <Text className="text-black">{data.secretKey}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>Role Name</Text>
                    <Text className="text-black">{data.roleName}</Text>
                </Flex>
                <Divider />
                <Flex flexDirection="row">
                    <Text>External ID</Text>
                    <Text className="text-black">{data.externalId}</Text>
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Back
                </Button>
                <Button onClick={() => onNext()} className="ml-3">
                    Submit
                </Button>
            </Flex>
        </Flex>
    )
}
