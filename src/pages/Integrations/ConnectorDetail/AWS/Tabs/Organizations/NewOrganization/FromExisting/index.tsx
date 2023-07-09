import { useState } from 'react'
import { Flex, Text } from '@tremor/react'
import Steps from '../../../../../../../../components/Steps'
import FirstStep from './FirstStep'

interface ISteps {
    close: any
    accounts: any
}

export default function FromExisting({ close, accounts }: ISteps) {
    const [stepNum, setStepNum] = useState(1)
    const [data, setData] = useState({
        accessKey: '',
        secretKey: '',
        roleName: '',
        externalId: '',
    })

    const showStep = (s: number) => {
        switch (s) {
            case 1:
                return (
                    <FirstStep
                        onPrevious={() => close()}
                        onNext={() => setStepNum(2)}
                        accounts={accounts}
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
            <Text className="my-6">Organization from existing AWS account</Text>
            <Steps steps={3} currentStep={stepNum} />
            {showStep(stepNum)}
        </Flex>
    )
}
