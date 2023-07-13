import { Grid } from '@tremor/react'
import { useComplianceApiV1FindingsMetricsList } from '../../../api/compliance.gen'
import SummaryCard from '../../../components/Cards/SummaryCard'

export default function Summary() {
    // const { response: metrics } = useComplianceApiV1FindingsMetricsList()
    // console.log(metrics)
    return (
        <Grid
            numItems={1}
            numItemsMd={2}
            numItemsLg={3}
            className="w-full gap-3"
        >
            <SummaryCard title="hi" metric="hi" />
            <SummaryCard title="hi" metric="hi" />
            <SummaryCard title="hi" metric="hi" />
        </Grid>
    )
}
