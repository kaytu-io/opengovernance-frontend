import { Button, Card, Flex, Grid, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { AWSIcon, AzureIcon } from '../../../icons/icons'
import { useIntegrationApiV1ConnectorsList } from '../../../api/integration.gen'
import { getErrorMessage } from '../../../types/apierror'

export default function Integration() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    const {
        response: responseConnectors,
        isLoading: connectorsLoading,
        error,
        sendNow: refresh,
    } = useIntegrationApiV1ConnectorsList()

    return (
        <>
            <Grid
                numItems={1}
                className={`gap-4 ${connectorsLoading ? 'animate-pulse' : ''}`}
            >
                {connectorsLoading || getErrorMessage(error).length > 0
                    ? [1, 2]?.map((i) => {
                          return (
                              <Card key={i} className="rounded-2xl">
                                  <div className="bg-slate-200 rounded-full w-12 h-12 border-none mb-3" />
                                  <div className="h-5 w-24 mb-1.5 bg-slate-200 rounded" />
                                  <div className="h-5 w-32 bg-slate-200 rounded" />
                              </Card>
                          )
                      })
                    : responseConnectors
                          ?.slice(0)
                          .reverse()
                          .map((connector) => {
                              return (
                                  <Card
                                      key={connector.name}
                                      onClick={() => {
                                          navigate(
                                              `/${workspace}/integrations/${connector.name}`
                                          )
                                      }}
                                      className={`rounded-2xl cursor-pointer ${
                                          connector.name === 'AWS'
                                              ? ''
                                              : 'bg-kaytu-800 text-white'
                                      }`}
                                  >
                                      <img
                                          id={`home-integration-${connector.name}`}
                                          src={
                                              connector.name === 'AWS'
                                                  ? AWSIcon
                                                  : AzureIcon
                                          }
                                          className="w-12 rounded-full mb-3"
                                          alt="aws"
                                      />
                                      <Flex>
                                          <Flex
                                              flexDirection="col"
                                              alignItems="start"
                                          >
                                              <Text className="font-semibold mb-1.5 text-inherit">
                                                  {connector.label}
                                              </Text>
                                              <Text className=" text-inherit">
                                                  # of Accounts:{' '}
                                                  {connector.connection_count}
                                              </Text>
                                          </Flex>
                                          <PlusCircleIcon className="w-5 text-amber-500" />
                                      </Flex>
                                  </Card>
                              )
                          })}
            </Grid>
            {error && (
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="absolute top-0 w-full left-0 h-full backdrop-blur"
                >
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Title className="mt-6">Failed to load component</Title>
                        <Text className="mt-2">{getErrorMessage(error)}</Text>
                    </Flex>
                    <Button
                        variant="secondary"
                        className="mb-6"
                        color="slate"
                        onClick={refresh}
                    >
                        Try Again
                    </Button>
                </Flex>
            )}
        </>
    )
}
