import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import Organizations from './Organizations'
import AccountList from './AccountList'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../api/api'

interface IAWS {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
    loading: boolean
}

export default function AWSTabs({ accounts, organizations, loading }: IAWS) {
    const [selectedTab, setSelectedTab] = useState(0)
    const navigate = useNavigate()
    const tabs = useLocation().hash
    useEffect(() => {
        if (tabs === '#organizations') {
            setSelectedTab(1)
        } else {
            setSelectedTab(0)
        }
    }, [tabs])
    return (
        <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
            <TabList className="mb-3">
                <Tab onClick={() => navigate('#accounts')}>AWS Accounts</Tab>
                <Tab onClick={() => navigate('#organizations')}>
                    Organizations
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <AccountList
                        accounts={accounts}
                        organizations={organizations}
                        loading={loading}
                    />
                </TabPanel>
                <TabPanel>
                    <Organizations
                        accounts={accounts}
                        organizations={organizations}
                    />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}
