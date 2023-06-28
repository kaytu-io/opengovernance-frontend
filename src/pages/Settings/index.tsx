import React from 'react'
import { Metric } from '@tremor/react'
import {
    BuildingOfficeIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import LoggedInLayout from '../../components/LoggedInLayout'
import SettingsMetadata from './metadata'
import SettingsMembers from './members'
import SettingsWorkspaceAPIKeys from './workspace_apikeys'
import SettingsProfile from './profile'
import SettingsOrganization from './organization'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    {
        name: 'Workspace',
        page: '',
        icon: HomeIcon,
    },
    {
        name: 'Metadata',
        page: 'metadata',
        component: <SettingsMetadata />,
    },
    {
        name: 'Members',
        page: 'members',
        component: <SettingsMembers />,
    },
    {
        name: 'API Keys',
        page: 'apikeys',
        component: <SettingsWorkspaceAPIKeys />,
    },
    {
        name: 'Organization',
        page: '',
        icon: BuildingOfficeIcon,
    },
    {
        name: 'Organization Info',
        page: 'org',
        component: <SettingsOrganization />,
    },
    {
        name: 'Personal',
        page: '',
        icon: UserIcon,
    },
    {
        name: 'Profile',
        page: 'profile',
        component: <SettingsProfile />,
    },
]

const Settings: React.FC<any> = () => {
    const workspace = useParams<{ ws: string }>().ws
    const currentSubPage = useParams<{ settingsPage: string }>().settingsPage

    return (
        <LoggedInLayout currentPage="settings" addContainer={false}>
            <main className="xl:pl-24 h-full bg-gray-50 dark:bg-gray-900">
                <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                    <main className="lg:pl-72">
                        {navigation
                            .filter(
                                (item) =>
                                    item.page === currentSubPage ||
                                    (!currentSubPage &&
                                        item.page === 'metadata')
                            )
                            .map((item) => item.component)}
                    </main>

                    <aside className="fixed inset-y-0 left-72 w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
                        <div className="lg:fixed lg:inset-y-0 lg:top-20 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                                <Metric className="text-gray-800">
                                    Settings
                                </Metric>
                                <nav className="flex flex-1 flex-col">
                                    <ul className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        {item.page === '' ? (
                                                            <div
                                                                className={classNames(
                                                                    'text-gray-400 font-semibold group flex gap-x-3 p-1'
                                                                )}
                                                            >
                                                                {item.icon && (
                                                                    <item.icon
                                                                        className="h-6 w-6 shrink-0"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                {item.name}
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                to={`/${workspace}/settings/${item.page}`}
                                                                className={classNames(
                                                                    item.page ===
                                                                        currentSubPage ||
                                                                        (!currentSubPage &&
                                                                            item.page ===
                                                                                'metadata')
                                                                        ? 'bg-blue-100 rounded-lg'
                                                                        : '',
                                                                    'text-gray-600 font-semibold group flex gap-x-3 p-1 px-12'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </LoggedInLayout>
    )
}

export default Settings
