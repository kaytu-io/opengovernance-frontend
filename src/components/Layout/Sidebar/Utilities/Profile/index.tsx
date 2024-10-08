import { Card, Flex, Tab, TabGroup, TabList, Text } from '@tremor/react'
import {
    ArrowTopRightOnSquareIcon,
    Bars2Icon,
} from '@heroicons/react/24/outline'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Popover, Transition } from '@headlessui/react'
import { useAtomValue } from 'jotai'
import { workspaceAtom } from '../../../../../store'
import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from '../../../../../api/api'
import { applyTheme, currentTheme } from '../../../../../utilities/theme'
import { useAuthApiV1UserPreferencesUpdate } from '../../../../../api/auth.gen'
import { useAuth } from '../../../../../utilities/auth'

interface IProfile {
    isCollapsed: boolean
}

export default function Profile({ isCollapsed }: IProfile) {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const workspace = useAtomValue(workspaceAtom)
    const { ws } = useParams()

    const [index, setIndex] = useState(
        // eslint-disable-next-line no-nested-ternary
        currentTheme() === 'system' ? 2 : currentTheme() === 'dark' ? 1 : 0
    )
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
    const [theme, setTheme] =
        useState<GithubComKaytuIoKaytuEnginePkgAuthApiTheme>(currentTheme())

    const { sendNow } = useAuthApiV1UserPreferencesUpdate(
        {
            theme,
        },
        {},
        false
    )

    useEffect(() => {
        if (isPageLoading) {
            setIsPageLoading(false)
            return
        }
        sendNow()
        applyTheme(theme)
    }, [theme])

    useEffect(() => {
        switch (index) {
            case 0:
                setTheme(GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeLight)
                break
            case 1:
                setTheme(GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeDark)
                break
            case 2:
                setTheme(GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeSystem)
                break
            default:
                setTheme(GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeLight)
                break
        }
    }, [index])

    return (
        <Popover className="relative asb z-50 border-0 w-full">
            <Popover.Button
                className={`p-3 w-full cursor-pointer ${
                    isCollapsed ? '!p-1' : 'border-t border-t-gray-700'
                }`}
                id="profile"
            >
                <Flex>
                    <Flex className="w-fit gap-3">
                        {user?.picture && (
                            <img
                                className={`${
                                    isCollapsed
                                        ? 'h-7 w-7 min-w-5'
                                        : 'h-10 w-10 min-w-10'
                                } rounded-full bg-gray-50`}
                                src={user.picture}
                                alt=""
                            />
                        )}
                        {!isCollapsed && (
                            <Flex flexDirection="col" alignItems="start">
                                <Text className="text-gray-200">
                                    {user?.name}
                                </Text>
                                <Text className="text-gray-400">
                                    {user?.email}
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                    <Bars2Icon className="h-6 w-6 stroke-2 text-gray-400" />
                </Flex>
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel
                    className={`absolute ${
                        isCollapsed ? 'left-[57px]' : 'left-[292px]'
                    } bottom-0 z-10`}
                >
                    <Card className="bg-kaytu-950 px-4 py-2 w-64 !ring-gray-600">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="pb-0 mb-0 "
                            // border-b border-b-gray-700
                        >
                            {/* <Text className="mb-1">ACCOUNT</Text> */}
                            <Flex
                                onClick={() => {
                                    // navigate(`/ws/${ws}/profile`)
                                    navigate(`/ws/main/profile`)
                                }}
                                className="py-2 px-5 rounded-md cursor-pointer text-gray-300 hover:text-gray-50 hover:bg-kaytu-800"
                            >
                                <Text className="text-inherit">
                                    Profile info
                                </Text>
                            </Flex>
                            {/* <Flex
                                onClick={() => navigate(`/ws/billing`)}
                                className="py-2 px-5 rounded-md cursor-pointer text-gray-300 hover:text-gray-50 hover:bg-kaytu-800"
                            >
                                <Text className="text-inherit">Billing</Text>
                            </Flex> */}
                            <Flex
                                onClick={() => logout()}
                                className="py-2 px-5 text-gray-300 rounded-md cursor-pointer hover:text-gray-50 hover:bg-kaytu-800"
                            >
                                <Text className="text-inherit">Logout</Text>
                                <ArrowTopRightOnSquareIcon className="w-5 text-gray-400" />
                            </Flex>
                        </Flex>
                        {/* <Flex flexDirection="col" alignItems="start">
                            <Text className="my-2">THEME</Text>
                            <TabGroup index={index} onIndexChange={setIndex}>
                                <TabList
                                    variant="solid"
                                    className="w-full bg-kaytu-800"
                                >
                                    <Tab className="w-1/3 flex justify-center ui-selected:!bg-kaytu-600 ui-selected:!border-0">
                                        <Text className="text-white">
                                            Light
                                        </Text>
                                    </Tab>
                                    <Tab className="w-1/3 flex justify-center  ui-selected:!bg-kaytu-600 ui-selected:!border-0">
                                        <Text className="text-white">Dark</Text>
                                    </Tab>
                                    <Tab className="w-1/3 flex justify-center ui-selected:!bg-kaytu-600 ui-selected:!border-0">
                                        <Text className="text-white">
                                            System
                                        </Text>
                                    </Tab>
                                </TabList>
                            </TabGroup>
                        </Flex> */}
                    </Card>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
