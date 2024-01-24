import { useAtomValue } from 'jotai'
import { useParams } from 'react-router-dom'
import SingleConnection from './SingleConnection'
import NotFound from '../../Errors'
import SingleMetric from './SingleMetric'
import TopHeader from '../../../components/Layout/Header'
import { defaultTime, useUrlDateRangeState } from '../../../utilities/urlstate'

export default function Single() {
    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { id, metric, resourceId } = useParams()
    const urlParams = window.location.pathname.split('/')

    const idGenerator = () => {
        if (metric) {
            if (urlParams[urlParams.length - 1].startsWith('account_')) {
                return metric.replace('account_', '')
            }
            if (urlParams[urlParams.length - 1].startsWith('metric_')) {
                return metric.replace('metric_', '')
            }
            return undefined
        }
        if (id) {
            if (urlParams[urlParams.length - 1].startsWith('account_')) {
                return id.replace('account_', '')
            }
            if (urlParams[urlParams.length - 1].startsWith('metric_')) {
                return id.replace('metric_', '')
            }
            return undefined
        }
        return undefined
    }

    const renderPage = () => {
        if (urlParams[urlParams.length - 1].startsWith('account_')) {
            return (
                <>
                    <TopHeader
                        datePicker
                        breadCrumb={['Cloud account detail']}
                    />
                    <SingleConnection
                        activeTimeRange={activeTimeRange}
                        id={idGenerator()}
                        resourceId={resourceId}
                    />
                </>
            )
        }
        if (urlParams[urlParams.length - 1].startsWith('metric_')) {
            return (
                <>
                    <TopHeader
                        datePicker
                        filter
                        breadCrumb={['Metric detail']}
                    />
                    <SingleMetric
                        activeTimeRange={activeTimeRange}
                        metricId={idGenerator()}
                        resourceId={resourceId}
                    />
                </>
            )
        }
        return <NotFound />
    }

    return renderPage()
}
