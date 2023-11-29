import { Button, Text, Flex, Bold } from '@tremor/react'
import { Checkbox } from 'pretty-checkbox-react'
import { useState } from 'react'

interface IPreRequisite {
    accountType: 'organization' | 'single'
    onPrev: () => void
    onNext: () => void
}

export function PreRequisite({ accountType, onPrev, onNext }: IPreRequisite) {
    const [understanding, setUnderstanding] = useState(false)
    const [adminAccess, setAdminAccess] = useState(false)
    const [stack, setStack] = useState(false)

    const item = (
        id: string,
        state: boolean,
        setState: (v: boolean) => void,
        label: string,
        expanded: string
    ) => {
        return (
            <Checkbox
                shape="curve"
                id={id}
                name={id}
                checked={state}
                onChange={(e) => {
                    setState(e.target.checked)
                }}
                className="py-2"
            >
                <label htmlFor={id} className="text-sm text-gray-500">
                    {label}
                </label>
            </Checkbox>
        )
    }

    const preRequisiteList = () => {
        if (accountType === 'organization') {
            return (
                <>
                    {item(
                        'understanding',
                        understanding,
                        setUnderstanding,
                        'I understanding how no-password secure onboarding works',
                        ''
                    )}
                    {item(
                        'adminAccess',
                        adminAccess,
                        setAdminAccess,
                        'I have administrative access to AWS Organization Account',
                        ''
                    )}
                    {item(
                        'stack',
                        stack,
                        setStack,
                        'I have the ability to run AWS Stacks and AWS StackSets',
                        ''
                    )}
                </>
            )
        }
        return (
            <>
                {item(
                    'understanding',
                    understanding,
                    setUnderstanding,
                    'I understanding how no-password secure onboarding works',
                    ''
                )}
                {item(
                    'adminAccess',
                    adminAccess,
                    setAdminAccess,
                    'I have administrative access to AWS Account',
                    ''
                )}
                {item(
                    'stack',
                    stack,
                    setStack,
                    'I have the ability to run AWS Stacks',
                    ''
                )}
            </>
        )
    }

    return (
        <Flex flexDirection="col" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Text className="text-gray-900 mb-4">
                    All boxes are required
                </Text>
                <Flex
                    flexDirection="col"
                    justifyContent="start"
                    alignItems="start"
                >
                    {preRequisiteList()}
                </Flex>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrev()}>
                    Back
                </Button>
                <Button
                    disabled={!understanding || !adminAccess || !stack}
                    onClick={() => onNext()}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
