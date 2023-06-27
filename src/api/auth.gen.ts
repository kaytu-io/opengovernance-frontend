import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackBenchmarkRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    DescribeInsightJob,
    GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    DescribeSummarizerJob,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAWSResourceResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential,
    GithubComKaytuIoKaytuEnginePkgAuthApiMembership,
    GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackInsightRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    GithubComKaytuIoKaytuEnginePkgInventoryApiService,
    GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    DescribeDescribeResourceJob,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob,
    DescribeDescribeSourceJob,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiGetSourcesRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkSummary,
    AwsResources,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAzureResourceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnector,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeStackRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiSource,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData,
    GithubComKaytuIoKaytuEnginePkgComplianceApiQuery,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    DescribeComplianceReportJob,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseAuthApiV1KeyDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyDetail = (
    id: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeyDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeyDetail(id, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyActivateCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyActivateCreate = (
    id: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeyActivateCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeyActivateCreate(id, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyDeleteDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1KeyDeleteDelete = (
    id: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeyDeleteDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeyDeleteDelete(id, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeySuspendCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeySuspendCreate = (
    id: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeySuspendCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeySuspendCreate(id, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([id, params]) !== lastInput) {
        setLastInput(JSON.stringify([id, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyCreateCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse
    error?: any
}

export const useAuthApiV1KeyCreateCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeyCreateCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeyCreateCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeyRoleCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey
    error?: any
}

export const useAuthApiV1KeyRoleCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeyRoleCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeyRoleCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1KeysListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey[]
    error?: any
}

export const useAuthApiV1KeysList = (params: RequestParams = {}) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1KeysListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1KeysList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RoleKeysDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey[]
    error?: any
}

export const useAuthApiV1RoleKeysDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1RoleKeysDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1RoleKeysDetail(roleName, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RoleUsersDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser[]
    error?: any
}

export const useAuthApiV1RoleUsersDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1RoleUsersDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1RoleUsersDetail(roleName, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RolesListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse[]
    error?: any
}

export const useAuthApiV1RolesList = (params: RequestParams = {}) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1RolesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1RolesList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1RolesDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse
    error?: any
}

export const useAuthApiV1RolesDetail = (
    roleName: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1RolesDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([roleName, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1RolesDetail(roleName, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([roleName, params]) !== lastInput) {
        setLastInput(JSON.stringify([roleName, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse
    error?: any
}

export const useAuthApiV1UserDetail = (
    userId: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserDetailState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([userId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserDetail(userId, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([userId, params]) !== lastInput) {
        setLastInput(JSON.stringify([userId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserWorkspaceMembershipDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiMembership[]
    error?: any
}

export const useAuthApiV1UserWorkspaceMembershipDetail = (
    userId: string,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] =
        useState<IuseAuthApiV1UserWorkspaceMembershipDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([userId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserWorkspaceMembershipDetail(userId, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([userId, params]) !== lastInput) {
        setLastInput(JSON.stringify([userId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserInviteDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserInviteDelete = (
    query: {
        userId: string
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserInviteDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserInviteDelete(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params]) !== lastInput) {
        setLastInput(JSON.stringify([query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserInviteCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserInviteCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserInviteCreateState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserInviteCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserRoleBindingDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingDelete = (
    query: {
        userId: string
    },
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingDeleteState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingDelete(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([query, params]) !== lastInput) {
        setLastInput(JSON.stringify([query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserRoleBindingUpdateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingUpdate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingUpdateState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingUpdate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UserRoleBindingsListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse
    error?: any
}

export const useAuthApiV1UserRoleBindingsList = (
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UserRoleBindingsListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingsList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1UsersListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse[]
    error?: any
}

export const useAuthApiV1UsersList = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseAuthApiV1UsersListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1UsersList(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([request, params]) !== lastInput) {
        setLastInput(JSON.stringify([request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseAuthApiV1WorkspaceRoleBindingsListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding[]
    error?: any
}

export const useAuthApiV1WorkspaceRoleBindingsList = (
    params: RequestParams = {}
) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] =
        useState<IuseAuthApiV1WorkspaceRoleBindingsListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.auth
                .apiV1WorkspaceRoleBindingsList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([params]) !== lastInput) {
        setLastInput(JSON.stringify([params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
