import { useEffect, useState } from 'react'
import {
    Button,
    Flex,
    List,
    ListItem,
    Select,
    SelectItem,
    Subtitle,
    Text,
    TextInput,
} from '@tremor/react'
import { useSetAtom } from 'jotai/index'
import { useAuthApiV1UserInviteCreate } from '../../../../api/auth.gen'
import { notificationAtom } from '../../../../store'

interface MemberInviteProps {
    close: (refresh: boolean) => void
}

export default function MemberInvite({ close }: MemberInviteProps) {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [auth, setAuth] = useState<string>('')


    const [role, setRole] = useState<string>('viewer')
    const [roleValue, setRoleValue] = useState<'viewer' | 'editor' | 'admin'>(
        'viewer'
    )
    const setNotification = useSetAtom(notificationAtom)

    const {
        isExecuted,
        isLoading,
        error,
        sendNow: createInvite,
    } = useAuthApiV1UserInviteCreate(
        { email_address: email || '', role: roleValue ,password: password },
        {},
        false
    )

    useEffect(() => {
        if (role === 'viewer' || role === 'editor' || role === 'admin') {
            setRoleValue(role)
        }
    }, [role])

    useEffect(() => {
        if (isExecuted && !isLoading) {
            setNotification({
                text: 'User successfully added',
                type: 'success',
            })
            close(true)
        }
        if (error) {
            setNotification({
                text: 'Unable to add new member',
                type: 'error',
            })
        }
    }, [isLoading, error])

    const roleItems = [
        {
            value: 'admin',
            title: 'Admin',
            description: 'Have full access',
        },
        {
            value: 'editor',
            title: 'Editor',
            description: 'Can view, edit and delete data',
        },
        {
            value: 'viewer',
            title: 'Viewer',
            description: 'Member can only view the data',
        },
    ]

    return (
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <List className="mt-4">
                <ListItem key="title">
                    <Flex justifyContent="start" className="truncate space-x-4">
                        <Subtitle className="text-gray-800 py-2">
                            New Member Info
                        </Subtitle>
                    </Flex>
                </ListItem>
                <ListItem key="email">
                    <Flex
                        justifyContent="between"
                        className="truncate space-x-4 py-2"
                    >
                        <Text className="font-medium text-gray-800">
                            Email
                            <span className="text-red-600 font-semibold">
                                *
                            </span>
                        </Text>
                        <TextInput
                            placeholder="email"
                            className="font-medium w-1/2 text-gray-800"
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                    </Flex>
                </ListItem>
                <ListItem key="password">
                    <Flex
                        justifyContent="between"
                        className="truncate space-x-4 py-2"
                    >
                        <Text className="font-medium text-gray-800">
                            Password
                            <span className="text-red-600 font-semibold">
                                *
                            </span>
                        </Text>
                        <TextInput
                            type="password"
                            placeholder="password"
                            className="font-medium w-1/2 text-gray-800"
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Flex>
                </ListItem>
                <ListItem key="authentication">
                    <Flex
                        justifyContent="between"
                        alignItems='start'
                        flexDirection='row'
                        className="truncate space-x-4 py-2"
                    >
                        <Text className="font-medium text-gray-800">
                            Authentication
                            <span className="text-red-600 font-semibold">
                                *
                            </span>
                        </Text>
                        <Select
                            className=" w-1/2 z-50 static h-[150px] "
                            value={auth}
                            onValueChange={setAuth}
                            placeholder="Authentication"
                        >
                            <SelectItem className="static" value="password">
                                Password
                            </SelectItem>
                            <SelectItem   className ='static' value="oicd">OIDC (SSO)</SelectItem>
                        </Select>
                    </Flex>
                </ListItem>
                <ListItem key="role">
                    <Flex
                        justifyContent="between"
                        alignItems="start"
                        className="truncate space-x-4"
                    >
                        <Text className="font-medium text-gray-800">
                            Role
                            <span className="text-red-600 font-semibold">
                                *
                            </span>
                        </Text>

                        <div className="space-y-5 sm:mt-0 w-1/2">
                            {roleItems.map((item) => {
                                return (
                                    <div className="relative flex items-start">
                                        <div className="absolute flex h-6 items-center">
                                            <input
                                                name="roles"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-kaytu-600 focus:ring-kaytu-700"
                                                onClick={() => {
                                                    setRole(item.value)
                                                }}
                                                checked={item.value === role}
                                            />
                                        </div>
                                        <div className="pl-7 text-sm leading-6">
                                            <div className="font-medium text-gray-900">
                                                {item.title}
                                            </div>
                                            <p className="text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Flex>
                </ListItem>
            </List>
            <Flex justifyContent="end" className="truncate space-x-4">
                <Button
                    disabled={isExecuted && isLoading}
                    onClick={() => close(false)}
                    variant="secondary"
                >
                    Cancel
                </Button>
                <Button
                    loading={isExecuted && isLoading}
                    disabled={email.length === 0}
                    onClick={() => createInvite()}
                >
                    Add
                </Button>
            </Flex>
        </Flex>
    )
}
