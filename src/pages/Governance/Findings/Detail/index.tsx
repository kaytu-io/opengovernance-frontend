import {
    Flex,
    Grid,
    List,
    ListItem,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
} from '@tremor/react'
import { useEffect } from 'react'
import JSONPretty from 'react-json-pretty'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiFinding } from '../../../../api/api'
import DrawerPanel from '../../../../components/DrawerPanel'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { useComplianceApiV1FindingsResourceCreate } from '../../../../api/compliance.gen'
import Spinner from '../../../../components/Spinner'
import { severityBadge } from '../../Compliance/BenchmarkSummary/Controls'

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
    const { response, isLoading, sendNow } =
        useComplianceApiV1FindingsResourceCreate(
            { kaytuResourceId: finding?.kaytuResourceID || '' },
            {},
            false
        )
    useEffect(() => {
        if (finding) {
            sendNow()
        }
    }, [finding])

    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={
                <Flex justifyContent="start">
                    {getConnectorIcon(finding?.connector)}
                    <Title className="text-lg font-semibold ml-2 my-1">
                        {finding?.resourceName}
                    </Title>
                </Flex>
            }
        >
            <Grid className="w-full gap-4 mb-6" numItems={2}>
                <SummaryCard
                    title="Account ID"
                    metric={finding?.providerConnectionID}
                    isString
                />
                <SummaryCard
                    title="Account name"
                    metric={finding?.providerConnectionName}
                    isString
                />
                <SummaryCard
                    title="Region"
                    metric={finding?.resourceLocation}
                    isString
                />
                <SummaryCard
                    title="Resource type"
                    metric={finding?.resourceType}
                    isString
                />
            </Grid>
            {/* <Flex justifyContent="start" className="flex-wrap gap-3 mb-6">
                <Tag text="hi" />
            </Flex> */}
            <TabGroup>
                <TabList>
                    <Tab>Controls</Tab>
                    <Tab disabled={!response?.resource}>Resources</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {isLoading ? (
                            <Spinner className="mt-12" />
                        ) : (
                            <List>
                                {response?.controls?.map((control) => (
                                    <ListItem>
                                        <Flex
                                            flexDirection="col"
                                            alignItems="start"
                                            className={`gap-1 w-fit max-w-[80%] border-l-2 pl-3 ${
                                                control.stateActive
                                                    ? 'border-l-emerald-500'
                                                    : 'border-l-rose-600'
                                            }`}
                                        >
                                            <Text className="text-gray-800 w-full truncate">
                                                {control.controlTitle}
                                            </Text>
                                            <Text className="w-full truncate">
                                                {control.reason}
                                            </Text>
                                        </Flex>
                                        {severityBadge(control.severity)}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <Title className="mb-2">JSON</Title>
                        <JSONPretty
                            json={response?.resource}
                            className="border border-gray-200 rounded-md py-1.5 px-3 text-sm font-mono"
                            theme={{
                                key: 'color:#2970BC;',
                            }}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </DrawerPanel>
    )
}
