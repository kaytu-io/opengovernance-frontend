import { List, ListItem, Text, Title } from '@tremor/react'
import { numberDisplay } from '../../../../../../../../utilities/numericDisplay'
import DrawerPanel from '../../../../../../../../components/DrawerPanel'
import { renderBadge, renderStatus } from '../index'

interface IDetail {
    selectedPolicy: any
    open: boolean
    onClose: () => void
}
export default function PolicyDetail({
    selectedPolicy,
    open,
    onClose,
}: IDetail) {
    return (
        <DrawerPanel
            open={open}
            onClose={onClose}
            title={selectedPolicy?.policy?.id}
        >
            <Title className="mb-2">{selectedPolicy?.policy?.title}</Title>
            <Text className="mb-6">{selectedPolicy?.policy?.description}</Text>
            <Title className="font-semibold">Metadata</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text>Connector</Text>
                    <Text>{selectedPolicy?.policy?.connector}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Policy ID</Text>
                    <Text>{selectedPolicy?.policy?.id}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Severity</Text>
                    {renderBadge(selectedPolicy?.policy?.severity)}
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>Outcome</Text>
                    {renderStatus(selectedPolicy?.passed)}
                </ListItem>
            </List>
            <Title className="font-semibold mt-4">Metadata</Title>
            <List>
                <ListItem className="py-6 flex items-start">
                    <Text># of failed resources</Text>
                    <Text>{`${numberDisplay(
                        selectedPolicy?.failedResourcesCount,
                        0
                    )} out of ${numberDisplay(
                        selectedPolicy?.totalResourcesCount,
                        0
                    )}`}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>% of failed resources</Text>
                    <Text>{`${numberDisplay(
                        ((selectedPolicy?.failedResourcesCount || 0) /
                            (selectedPolicy?.totalResourcesCount || 0)) *
                            100 || 0
                    )} %`}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text># of failed accounts</Text>
                    <Text>{`${numberDisplay(
                        selectedPolicy?.failedConnectionCount,
                        0
                    )} out of ${numberDisplay(
                        selectedPolicy?.totalConnectionCount,
                        0
                    )}`}</Text>
                </ListItem>
                <ListItem className="py-6 flex items-start">
                    <Text>% of failed accounts</Text>
                    <Text>{`${numberDisplay(
                        ((selectedPolicy?.failedConnectionCount || 0) /
                            (selectedPolicy?.totalConnectionCount || 0)) *
                            100 || 0
                    )} %`}</Text>
                </ListItem>
            </List>
        </DrawerPanel>
    )
}
