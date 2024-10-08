import {
    Badge,
    Button,
    Divider,
    Flex,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../../api/api'
import { dateDisplay } from '../../../../../../../utilities/dateDisplay'
import {
    useIntegrationApiV1CredentialDelete,
    useIntegrationApiV1CredentialsAzureAutoonboardCreate,
} from '../../../../../../../api/integration.gen'

interface IPriInfo {
    data:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential
        | undefined
    open: boolean
    onClose: () => void
    isDemo: boolean
}

export default function DirectoryInfo({
    data,
    open,
    onClose,
    isDemo,
}: IPriInfo) {
    const [id, setId] = useState('')
    const [eid, seteId] = useState(false)
    const [value, setValue] = useState('')
    const [evalue, seteValue] = useState(false)

    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useIntegrationApiV1CredentialDelete(data?.id || '', {}, false)

    const {
        isExecuted: isDiscoverExecuted,
        isLoading: isDiscoverLoading,
        sendNow: discoverNow,
    } = useIntegrationApiV1CredentialsAzureAutoonboardCreate(
        data?.id || '',
        {},
        false
    )

    // useEffect(() => {
    //     if (isDeleteExecuted && !isDeleteLoading) {
    //         onClose()
    //     }
    // }, [isDeleteLoading])

    useEffect(() => {
        if (isDiscoverExecuted && !isDiscoverLoading) {
            onClose()
        }
    }, [isDiscoverLoading])

    return (
        <DrawerPanel
            title="Service Principal"
            open={open}
            onClose={() => onClose()}
        >
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title>SPN info</Title>
                    <Divider />
                    <Flex>
                        <Text>Name</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.name}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Application ID</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.metadata?.organization_master_account_email}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Object ID</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.metadata?.object_id}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Directory ID</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.metadata?.organization_master_account_email}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>State</Text>
                        <Badge
                            color={
                                data?.healthStatus === 'healthy'
                                    ? 'green'
                                    : 'rose'
                            }
                        >
                            {data?.healthStatus}
                        </Badge>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Last health check</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {dateDisplay(data?.lastHealthCheckTime)}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex
                        flexDirection={eid ? 'col' : 'row'}
                        alignItems={eid ? 'start' : 'center'}
                    >
                        <Text className="whitespace-nowrap">Secret ID</Text>
                        {eid ? (
                            <>
                                <TextInput
                                    className="w-full my-3"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                                <Flex justifyContent="end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => seteId(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="ml-3">Save</Button>
                                </Flex>
                            </>
                        ) : (
                            <Flex justifyContent="end">
                                <Text
                                    className={
                                        isDemo
                                            ? 'blur-sm text-black'
                                            : 'text-black'
                                    }
                                >
                                    {data?.metadata?.secret_id}
                                </Text>
                                <Button
                                    variant="light"
                                    className="ml-3"
                                    onClick={() => {
                                        setId(data?.metadata?.secret_id)
                                        seteId(true)
                                    }}
                                >
                                    Edit
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Divider />
                    <Flex
                        flexDirection={evalue ? 'col' : 'row'}
                        alignItems={evalue ? 'start' : 'center'}
                    >
                        <Text className="whitespace-nowrap">Secret value</Text>
                        {evalue ? (
                            <>
                                <TextInput
                                    className="w-full my-3"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <Flex justifyContent="end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => seteValue(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="ml-3">Save</Button>
                                </Flex>
                            </>
                        ) : (
                            <Flex justifyContent="end">
                                <Text
                                    className={
                                        isDemo
                                            ? 'blur-sm text-black'
                                            : 'text-black'
                                    }
                                >
                                    *****************
                                </Text>
                                <Button
                                    variant="light"
                                    className="ml-3"
                                    onClick={() => seteValue(true)}
                                >
                                    Edit
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Number of subscriptions</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.total_connections}
                        </Text>
                    </Flex>
                </Flex>
                <Flex justifyContent="end" className="my-6">
                    <Button
                        variant="secondary"
                        color="rose"
                        // loading={isDeleteExecuted && isDeleteLoading}
                        disabled={isDiscoverExecuted && isDiscoverLoading}
                        // onClick={deleteNow}
                    >
                        Delete
                    </Button>

                    <Button
                        className="ml-3"
                        loading={isDiscoverExecuted && isDiscoverLoading}
                        // disabled={isDeleteExecuted && isDeleteLoading}
                        onClick={discoverNow}
                    >
                        Discover New Subscriptions
                    </Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
