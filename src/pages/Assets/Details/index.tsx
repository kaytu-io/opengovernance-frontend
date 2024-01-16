import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import { useEffect, useState } from 'react'
import { filterAtom, timeAtom } from '../../../store'
import Metrics from './Tabs/Metrics'
import CloudAccounts from './Tabs/CloudAccounts'
import TopHeader from '../../../components/Layout/Header'

export default function AssetDetails() {
    const navigate = useNavigate()
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const url = window.location.pathname.split('/')
    const currentPage = url[3]
    const { resourceId } = useParams()
    const [selectedTab, setSelectedTab] = useState(0)
    const tabs = useLocation().hash
    useEffect(() => {
        switch (currentPage) {
            case 'metrics':
                setSelectedTab(0)
                break
            case 'accounts':
                setSelectedTab(1)
                break
            default:
                setSelectedTab(0)
                break
        }
    }, [currentPage])

    return (
        <>
            <TopHeader
                breadCrumb={['Assets detail']}
                filter={!url.includes('resource-collection')}
                datePicker
            />
            <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
                <TabList className="mb-3">
                    <Tab onClick={() => navigate(`/${url[1]}/assets/metrics`)}>
                        Metrics
                    </Tab>
                    <Tab onClick={() => navigate(`/${url[1]}/assets/accounts`)}>
                        Cloud accounts
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Metrics
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            resourceId={resourceId}
                            isSummary={tabs === '#category'}
                        />
                    </TabPanel>
                    <TabPanel>
                        <CloudAccounts
                            activeTimeRange={activeTimeRange}
                            connections={selectedConnections}
                            resourceId={resourceId}
                        />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
