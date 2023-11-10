import { Button, Flex, Text, TextInput } from '@tremor/react'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline'

interface IWorkspaceInformation {
    open: boolean
    name: string
    isLoading: boolean
    setName: (name: string) => void
    done: boolean
    onDone: () => void
}
export function WorkspaceInformation({
    open,
    name,
    isLoading,
    setName,
    done,
    onDone,
}: IWorkspaceInformation) {
    return (
        <div className="p-6 border-b border-b-gray-200">
            <Flex justifyContent="between">
                <Flex alignItems="start" justifyContent="start">
                    <CheckCircleIcon
                        height={20}
                        className={done ? 'text-emerald-500' : 'text-gray-500'}
                    />
                    <Text className="ml-2 text-sm text-gray-800">
                        2. Workspace Information
                    </Text>
                </Flex>
                <div>
                    {open ? (
                        <ChevronUpIcon height={20} color="text-blue-500" />
                    ) : (
                        <ChevronDownIcon height={20} color="text-blue-500" />
                    )}
                </div>
            </Flex>
            {open && (
                <div className="m-6">
                    <Flex justifyContent="start">
                        <Text className="font-normal text-sm text-gray-500">
                            The setup steps vary depending on the cloud service
                            you choose.
                        </Text>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        justifyContent="between"
                        className="w-1/2 my-3"
                    >
                        <Text className="font-medium text-sm text-gray-900">
                            Name*
                        </Text>
                        <TextInput
                            value={name}
                            className="w-2/3"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Flex>
                    <Flex justifyContent="start" className="mt-3">
                        <Button onClick={onDone} loading={isLoading}>
                            Next
                        </Button>
                    </Flex>
                </div>
            )}
        </div>
    )
}
