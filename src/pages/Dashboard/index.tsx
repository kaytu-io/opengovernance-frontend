import Cal, { getCalApi } from '@calcom/embed-react'
import { Flex, Text, Title } from '@tremor/react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TopHeader from '../../components/Layout/Header'
import { Card, Select, SelectItem } from '@tremor/react'
import Modal from '../../components/Modal'
import {
    ChevronRightIcon,
    DocumentTextIcon,
    PlusIcon,
} from '@heroicons/react/24/outline'
const data = [
    {
        id: 1,
        name: 'Infrastructure Summary',
        description: 'Description',
        page: 'infrastructure',
    },
    {
        id: 2,
        name: 'Spend Summary',
        description: 'Description',
        page: 'spend',
    },
    {
        id: 3,
        name: 'Infrastructure - Cloud Accounts',
        description: 'Description',
        page: 'infrastructure-cloud-accounts',
    },
    {
        id: 4,
        name: 'Infrastructure - Cloud Services',
        description: 'Description',
        page: 'infrastructure-metrics',
    },
    {
        id: 5,
        name: 'Spend - Cloud Accounts',
        description: 'Description',
        page: 'spend-accounts',
    },
    {
        id: 6,
        name: 'Spend - Cloud Services',
        description: 'Description',
        page: 'spend-metrics',
    },
]
export default function Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [open, setOpen] = useState<boolean>(false)
    const workspace = useParams<{ ws: string }>().ws
       
    const f = async () => {
        const cal = await getCalApi({ namespace: 'try-enterprise' })
        cal('ui', {
            styles: { branding: { brandColor: '#000000' } },
            hideEventTypeDetails: false,
            layout: 'month_view',
        })
    }

    return (
        <>
            <TopHeader />
            <Flex
                className="bg-white w-full rounded-xl border-solid  border-2 border-gray-200 "
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
            >
                <div className="border-b w-full rounded-xl border-tremor-border bg-tremor-background-muted p-4 dark:border-dark-tremor-border dark:bg-gray-950 sm:p-6 lg:p-8">
                    <header>
                        <h1 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Documantation
                        </h1>
                        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                            Explore and manage your Dashboards
                        </p>
                        <div className="mt-8 w-full md:flex md:max-w-3xl md:items-stretch md:space-x-4">
                            <Card className="w-full md:w-7/12">
                                <div className="inline-flex items-center justify-center rounded-tremor-small border border-tremor-border p-2 dark:border-dark-tremor-border">
                                    <DocumentTextIcon
                                        className="size-5 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis"
                                        aria-hidden={true}
                                    />
                                </div>
                                <h3 className="mt-4 text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    <a
                                        href="https://docs.opengovernance.io/"
                                        className="focus:outline-none"
                                    >
                                        {/* Extend link to entire card */}
                                        <span
                                            className="absolute inset-0"
                                            aria-hidden={true}
                                        />
                                        Documentation
                                    </a>
                                </h3>
                                <p className="dark:text-dark-tremor-cont text-tremor-default text-tremor-content">
                                    Lorem ipsum dolor sit amet, consetetur
                                    sadipscing elitr.
                                </p>
                            </Card>
                        </div>
                    </header>
                </div>
                <div className="w-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <main>
                            <div className="flex items-center justify-between">
                                <h2 className="text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    Available Dashboards
                                </h2>
                                <div className="flex items-center space-x-2">
                                    {/* <Select
                                        placeholder="Sorty by"
                                        enableClear={false}
                                        className="[&>button]:rounded-tremor-small"
                                    >
                                        <SelectItem value="1">Name</SelectItem>
                                        <SelectItem value="2">
                                            Last edited
                                        </SelectItem>
                                        <SelectItem value="3">Size</SelectItem>
                                    </Select> */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            f()
                                            setOpen(true)
                                        }}
                                        className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-tremor-small bg-tremor-brand px-3 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:inline-flex"
                                    >
                                        <PlusIcon
                                            className="-ml-1 size-5 shrink-0"
                                            aria-hidden={true}
                                        />
                                        Add
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                {data.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="rounded-tremor-small p-4 hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
                                    >
                                        {/* content placeholder */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 truncate">
                                                <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                                    <a
                                                        href={`/ws/${workspace}/dashboard/${item.page}`}
                                                        className="focus:outline-none"
                                                    >
                                                        {/* Extend link to entire card */}
                                                        <span
                                                            className="absolute inset-0"
                                                            aria-hidden={true}
                                                        />
                                                        {item.name}
                                                    </a>
                                                </h4>
                                                <p className="truncate text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <ChevronRightIcon
                                                className="size-5 shrink-0 text-tremor-content-subtle dark:text-tremor-content"
                                                aria-hidden={true}
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </Flex>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Title className="text-black !text-xl font-bold w-full text-center mb-4">
                    Create custom dashboards for teams, functions, and
                    roles—In-App or through BI tools like PowerBI, Tableau,
                    Looker, or Grafana.
                </Title>
                <Cal
                    namespace="try-enterprise"
                    calLink="team/open-governance/try-enterprise"
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'scroll',
                    }}
                    config={{ layout: 'month_view' }}
                />
            </Modal>
        </>
    )
}
