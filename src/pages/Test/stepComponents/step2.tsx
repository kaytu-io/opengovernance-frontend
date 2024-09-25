import {
    ArrowTopRightOnSquareIcon,
    BanknotesIcon,
    ChevronRightIcon,
    CubeIcon,
    CursorArrowRaysIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { Card, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import Check from '../../../icons/Check.svg'
import User from '../../../icons/User.svg'
import Dollar from '../../../icons/Dollar.svg'
import Cable from '../../../icons/Cable.svg'
import Cube from '../../../icons/Cube.svg'
import Checkbox from '@cloudscape-design/components/checkbox'
import {
    Box,
    Container,
    Header,
    FormField,
    RadioGroup,
    SpaceBetween,
    Select,
    Tiles,
    TextContent,
    Link,
} from '@cloudscape-design/components'
import { link } from 'fs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import ConnectorCard from '../../../components/Cards/ConnectorCard'
import Input from '@cloudscape-design/components/input'

interface Props {
    setLoading: Function
}

export default function Integrations({ setLoading }: Props) {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const [connection, setConnection] = useState('aws')
    const [dataType, setDataType] = useState('manual')
    const [awsData, setAwsData] = useState()
    const [azureData, setAzureData] = useState()

    useEffect(() => {
        setLoading(true)
    }, [])
    return (
        <>
            <Box margin={{ bottom: 'l' }}>
                <Container
                    header={<Header variant="h2">Setup Integrations</Header>}
                >
                    <SpaceBetween size="s">
                        <Grid
                            numItems={2}
                            className="gap-28 w-full flex flex-row  justify-center items-center"
                        >
                            <ConnectorCard
                                connector={'Amazon Web Services'}
                                title={'Amazon Web Services'}
                                status={'first-time'}
                                count={0}
                                description={''}
                                // @ts-ignore
                                tier={'community'}
                                logo={
                                    'https://raw.githubusercontent.com/kaytu-io/website/main/connectors/icons/aws.svg'
                                }
                                onClickCard={() => {
                                    setConnection('aws')
                                }}
                            />
                            <ConnectorCard
                                connector={'Azure'}
                                title={'Azure'}
                                status={'first-time'}
                                count={0}
                                description={''}
                                // @ts-ignore
                                tier={'community'}
                                logo={
                                    'https://raw.githubusercontent.com/kaytu-io/website/main/connectors/icons/azure.svg'
                                }
                                onClickCard={() => {
                                    setConnection('azure')
                                }}
                            />
                        </Grid>
                        <SpaceBetween size="l">
                            {connection === 'aws' && (
                                <>
                                    <TextContent>
                                        <h3>Amazon Web Services</h3>
                                        <div>
                                            <Box
                                                variant="p"
                                                color="text-body-secondary"
                                            >
                                                Amazon Aurora is a MySQL- and
                                                PostgreSQL-compatible
                                                enterprise-class database,
                                                starting at &lt;$1/day.
                                            </Box>
                                            AWS Account Integration lets you
                                            onboard your entire organization,
                                            offering spend tracking, seamless
                                            visibility, governance, compliance,
                                            and AWS management.
                                        </div>
                                    </TextContent>
                                </>
                            )}
                            {connection === 'azure' && (
                                <>
                                    <TextContent>
                                        <h3>Azure</h3>
                                        <div>
                                            <Box
                                                variant="p"
                                                color="text-body-secondary"
                                            >
                                                Amazon Aurora is a MySQL- and
                                                PostgreSQL-compatible
                                                enterprise-class database,
                                                starting at &lt;$1/day.
                                            </Box>
                                            Azure Subscription Integration
                                            enables connection via an SPN for
                                            spend tracking, seamless visibility,
                                            governance, compliance, and
                                            efficient management.
                                        </div>
                                    </TextContent>
                                </>
                            )}
                            <FormField
                                label="Choose Setup"
                                stretch={true}
                                info={''}
                            >
                                <Tiles
                                    value={dataType}
                                    onChange={({ detail }) =>
                                        setDataType(detail.value)
                                    }
                                    items={[
                                        {
                                            value: 'manual',
                                            label: `Setup ${
                                                connection == 'azure'
                                                    ? 'Azure'
                                                    : 'AWS'
                                            } Integration`,
                                            description: '',
                                        },
                                        {
                                            value: 'sample',
                                            label: 'Load Sample Data',
                                            description: '',
                                        },
                                    ]}
                                />
                            </FormField>
                            {connection == 'aws' && dataType == 'manual' && (
                                <>
                                    <FormField
                                        // constraintText="Requirements and constraints for the field."
                                        className="w-full"
                                        // stretch
                                        description={
                                            <>
                                                <Link href="https://docs.opengovernance.io/oss/how-to-guide/setup-integrations/setup-aws-integration">
                                                    Click here
                                                </Link>{' '}
                                                for details setup your AWS
                                                Accounts
                                            </>
                                        }
                                        errorText=""
                                        label="Integration Details"
                                    >
                                        <Flex
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            className="gap-3 w-full"
                                        >
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Access Key "
                                            />
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Access Secret"
                                            />
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Role"
                                            />
                                        </Flex>
                                    </FormField>
                                </>
                            )}
                            {connection == 'azure' && dataType == 'manual' && (
                                <>
                                    <FormField
                                        className="w-full"
                                        // constraintText="Requirements and constraints for the field."
                                        description={
                                            <>
                                                <Link href="https://docs.opengovernance.io/oss/how-to-guide/setup-integrations/setup-azure-subscription">
                                                    Click here
                                                </Link>{' '}
                                                for details setup your Azure
                                                Accounts
                                            </>
                                        }
                                        errorText=""
                                        label="Integration Details"
                                    >
                                        <Flex
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            className="gap-3"
                                        >
                                            {/* @ts-ignore */}

                                            <Input
                                                className="w-2/3"
                                                placeholder="Application (client) ID "
                                            />
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Object ID"
                                            />
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Directory (tenant) ID"
                                            />
                                            {/* @ts-ignore */}
                                            <Input
                                                className="w-2/3"
                                                placeholder="Secret Value"
                                            />
                                        </Flex>
                                    </FormField>
                                </>
                            )}

                            {/* {ENGINE_DETAILS[engineOption]}
                            
                            <div className="custom-screenshot-hide">
                                <Box variant="awsui-key-label">
                                    License model
                                </Box>
                                <div>{getEngineLicense(engineOption)}</div>
                            </div>
                            <RadioOption {...childProps} />
                            {ENGINE_VERSIONS[engineOption] && (
                                <Version {...childProps} />
                            )} */}
                        </SpaceBetween>
                    </SpaceBetween>
                </Container>
            </Box>
        </>
    )
}
