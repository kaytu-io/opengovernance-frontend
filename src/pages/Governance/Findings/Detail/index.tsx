import { Divider, List, ListItem, Text, Title } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFinding } from '../../../../api/api'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import DrawerPanel from '../../../../components/DrawerPanel'

interface IFindingDetail {
    finding: GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    open: boolean
    onClose: () => void
}

export default function FindingDetail({
    finding,
    open,
    onClose,
}: IFindingDetail) {
    return (
        <DrawerPanel open={open} onClose={onClose} title="Reason">
            <Title>Summary</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Severity</Text>
                    <Text className="text-gray-800">{finding?.severity}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>State</Text>
                    <Text className="text-gray-800">
                        {finding?.stateActive ? 'Active' : 'Not active'}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy name</Text>
                    <Text className="text-gray-800">
                        {finding?.policyTitle}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Reason</Text>
                    <Text className="text-gray-800">{finding?.reason}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Last checked</Text>
                    <Text className="text-gray-800">
                        {dateTimeDisplay(finding?.evaluatedAt)}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource name</Text>
                    <Text className="text-gray-800">
                        {finding?.resourceName}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource type</Text>
                    <Text className="text-gray-800">
                        {finding?.resourceType}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Root benchmark</Text>
                    <Text className="text-gray-800">
                        {finding?.parentBenchmarks}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Account name</Text>
                    <Text className="text-gray-800">
                        {finding?.providerConnectionName}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Account ID</Text>
                    <Text className="text-gray-800">
                        {finding?.providerConnectionID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource ID</Text>
                    <Text className="text-gray-800">{finding?.resourceID}</Text>
                </ListItem>
            </List>
            <Divider />
            <Title>Policy details</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy title</Text>
                    <Text className="text-gray-800">
                        {finding?.policyTitle}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy name</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Benchmark title</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Benchmark name</Text>
                </ListItem>
            </List>
            <Divider />
            <Title>Hierarchy</Title>
            <List>
                {finding?.parentBenchmarks?.map((h, i) => (
                    <ListItem className="py-6 flex items-start">
                        <Text>{`Level ${i}`}</Text>
                        <Text className="text-kaytu-800">{h}</Text>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Title>Job details</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Finding ID</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Cloud account ID</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Connection ID</Text>
                    <Text className="text-gray-800">
                        {finding?.connectionID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Compliance job ID</Text>
                    <Text className="text-gray-800">
                        {finding?.complianceJobID}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Resource type namespace</Text>
                    <Text className="text-gray-800">
                        {finding?.resourceTypeName}
                    </Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Kaytu connection ID</Text>
                </ListItem>
            </List>
        </DrawerPanel>
    )
}
