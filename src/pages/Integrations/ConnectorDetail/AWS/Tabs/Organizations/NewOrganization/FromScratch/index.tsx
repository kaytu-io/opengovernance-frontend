import { Flex, Text } from '@tremor/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FinalStep from './FinalStep'
import Steps from '../../../../../../../../components/Steps'
import { useOnboardApiV1CredentialCreate } from '../../../../../../../../api/onboard.gen'
import Spinner from '../../../../../../../../components/Spinner'
import { getErrorMessage } from '../../../../../../../../types/apierror'
import { SourceType } from '../../../../../../../../api/api'
import { useWorkspaceApiV1BootstrapCredentialCreate } from '../../../../../../../../api/workspace.gen'

interface ISteps {
    bootstrapMode: boolean
    onClose: () => void
}

export default function FromScratch({ onClose, bootstrapMode }: ISteps) {
    const currentWorkspace = useParams<{ ws: string }>().ws
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        accessKey: '',
        secretKey: '',
        roleName: '',
        adminRoleName: '',
        externalId: '',
        policyName: '',
    })

    const close = () => {
        setStepNum(1)
        setData({
            accessKey: '',
            secretKey: '',
            roleName: '',
            adminRoleName: '',
            externalId: '',
            policyName: '',
        })
        onClose()
    }

    const { error, isLoading, isExecuted, sendNow } =
        useOnboardApiV1CredentialCreate(
            {
                source_type: SourceType.CloudAWS,
                config: {
                    accessKey: data.accessKey,
                    secretKey: data.secretKey,
                    assumeRoleName: data.roleName,
                    assumeAdminRoleName: data.adminRoleName,
                    externalId: data.externalId,
                    assumeRolePolicyName: data.policyName,
                },
            },
            {},
            false
        )

    const {
        error: bcError,
        isLoading: bcIsLoading,
        isExecuted: bcIsExecuted,
        sendNow: bcSendNow,
    } = useWorkspaceApiV1BootstrapCredentialCreate(
        currentWorkspace || '',
        {
            connectorType: SourceType.CloudAWS,
            config: {
                accessKey: data.accessKey,
                secretKey: data.secretKey,
                assumeRoleName: data.roleName,
                assumeAdminRoleName: data.adminRoleName,
                externalId: data.externalId,
                assumeRolePolicyName: data.policyName,
            },
        },
        {},
        false
    )

    if ((isLoading && isExecuted) || (bcIsLoading && bcIsExecuted)) {
        return <Spinner />
    }

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={close}
                        onNext={() => setStepNum(2)}
                    />
                )
            case 2:
                return (
                    <SecondStep
                        onPrevious={() => setStepNum(1)}
                        onNext={() => setStepNum(3)}
                    />
                )
            case 3:
                return (
                    <ThirdStep
                        onPrevious={() => setStepNum(2)}
                        onNext={(
                            accessKey,
                            secretKey,
                            roleName,
                            adminRoleName,
                            externalId,
                            policyName
                        ) => {
                            setData({
                                accessKey,
                                secretKey,
                                roleName,
                                adminRoleName,
                                externalId,
                                policyName,
                            })
                            setStepNum(4)
                        }}
                    />
                )
            case 4:
                return (
                    <FinalStep
                        accessKeyParam={data.accessKey}
                        secretKey={data.secretKey}
                        roleName={data.roleName}
                        externalId={data.externalId}
                        onPrevious={() => setStepNum(3)}
                        error={getErrorMessage(bootstrapMode ? bcError : error)}
                        isLoading={
                            (isExecuted && isLoading) ||
                            (bcIsExecuted && bcIsLoading)
                        }
                        onSubmit={() => {
                            if (bootstrapMode) {
                                bcSendNow()
                            } else {
                                sendNow()
                            }
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            className="h-full"
        >
            <Text className="my-6">Organization from new AWS account</Text>
            <Steps steps={4} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
