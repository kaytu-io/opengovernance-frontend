import React, { Dispatch } from 'react'
import SummaryMetrics from './SummaryMetrics'
import CostMetrics from './CostMetrics'

type IProps = {
    provider: any
    connections: any
    categories: any
    timeRange: any
    pageSize: any
    setActiveSubPage: Dispatch<any>
}
export default function SummaryTab({
    provider,
    connections,
    categories,
    timeRange,
    pageSize,
    setActiveSubPage,
}: IProps) {
    return (
        <>
            <SummaryMetrics
                provider={provider}
                connection={connections}
                timeRange={timeRange}
                pageSize={pageSize}
                setActiveSubPage={setActiveSubPage}
            />
            <div className="mt-10">
                <CostMetrics
                    provider={provider}
                    connection={connections}
                    categories={categories}
                    timeRange={timeRange}
                    pageSize={pageSize}
                    setActiveSubPage={setActiveSubPage}
                />
            </div>
        </>
    )
}
