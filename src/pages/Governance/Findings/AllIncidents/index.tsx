import {
    Flex,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@tremor/react'
import { useEffect, useState } from 'react'

import ResourcesWithFailure from '../ResourcesWithFailure'
import ControlsWithFailure from '../ControlsWithFailure'
import Tabs from '@cloudscape-design/components/tabs'

import Spinner from '../../../../components/Spinner'
import {
    SourceType,
    TypesFindingSeverity,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
} from '../../../../api/api'
import { DateRange } from '../../../../utilities/urlstate'
import FailingCloudAccounts from '../FailingCloudAccounts'
import Events from '../Events'
import FindingsWithFailure from '../FindingsWithFailure'
interface ICount {
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
    eventTimeRange: DateRange | undefined
    jobID: string[] | undefined
}
interface Props {
    query: ICount
    setSelectedGroup: Function
    tab: number
    setTab: Function
}
const GROUPS ={0:'findings' ,1:'events'}
export default function AllIncidents({ query, setSelectedGroup ,tab,setTab}: Props) {
    return (
        <>
            <FindingsWithFailure query={query} />

            {/* <Tabs
                onChange={({ detail }) => {
                    setTab(parseInt(detail.activeTabId))
                    // @ts-ignore
                    setSelectedGroup(GROUPS[parseInt(detail.activeTabId)])
                }}
                activeTabId={tab.toString()}
                tabs={[
                    {
                        label: 'All Incidents',
                        id: '0',
                        content: (
                            <>
                                {tab == 0 && (
                                    <>
                                        <FindingsWithFailure query={query} />
                                    </>
                                )}
                            </>
                        ),
                    },
                    {
                        label: ' Drift Events',
                        id: '1',
                        content: <>{tab == 1 && <Events query={query} />}</>,
                    },
                 
                ]}
            /> */}
        </>
    )
}
