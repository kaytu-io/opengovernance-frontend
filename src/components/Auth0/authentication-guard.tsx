import { withAuthenticationRequired } from '@auth0/auth0-react'
import React from 'react'
import { Flex } from '@tremor/react'
import Spinner from '../Spinner'

interface IAuthenticationGuard {
    component: React.ComponentType
}

export const AuthenticationGuard: React.FC<IAuthenticationGuard> = ({
    component,
}) => {
    const Component = withAuthenticationRequired(component, {
        // eslint-disable-next-line react/no-unstable-nested-components
        onRedirecting: () => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="w-full h-screen dark:bg-gray-900"
                >
                    <Spinner />
                </Flex>
            )
        },
    })
    return <Component />
}
