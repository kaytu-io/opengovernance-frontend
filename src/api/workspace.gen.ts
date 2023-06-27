import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleDetailsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourceRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroupTrendResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiUpdateKeyRoleRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackBenchmarkRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiServiceSummary,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkResultTrend,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiService,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmark,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiComplianceReport,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    DescribeComplianceReportJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeStackRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgComplianceApiQuery,
    GithubComKaytuIoKaytuEnginePkgDescribeApiInsightJob,
    GithubComKaytuIoKaytuEnginePkgDescribeApiSource,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationByProviderResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiMembership,
    GithubComKaytuIoKaytuEnginePkgInventoryApiLocationResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSingleResourceRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiRolesListResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiAzureCredential,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceSummariesResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    AwsResources,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServiceMetadataResponse,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiDescribeSource,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgDescribeApiResourceTypeDetail,
    GithubComKaytuIoKaytuEnginePkgInventoryApiConnectionData,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAWSResourceResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiChangeConnectionLifecycleStateRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerBenchmarkEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetFiltersResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStackInsightRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgAuthApiRoleUser,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiGetSourcesRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkSummary,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    DescribeDescribeSourceJob,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetAzureResourceResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnector,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgInsightEsInsightResource,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionCountRequest,
    GithubComKaytuIoKaytuEnginePkgDescribeApiListBenchmarkEvaluationsRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiPolicy,
    GithubComKaytuIoKaytuEnginePkgDescribeApiTriggerInsightEvaluationRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    DescribeDescribeResourceJob,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgInventoryApiGetResourcesRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    DescribeInsightJob,
    DescribeSummarizerJob,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseWorkspaceApiV1WorkspaceCreateState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse
    error?: any
}

export const useWorkspaceApiV1WorkspaceCreate = (
    request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
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

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspaceCreateState>({
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
            api.workspace
                .apiV1WorkspaceCreate(request, params)
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

interface IuseWorkspaceApiV1WorkspaceDeleteState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceDelete = (
    workspaceId: string,
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

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspaceDeleteState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceDelete(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceNameCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceNameCreate = (
    workspaceId: string,
    request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
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
        useState<IuseWorkspaceApiV1WorkspaceNameCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceNameCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceOrganizationCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceOrganizationCreate = (
    workspaceId: string,
    request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
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
        useState<IuseWorkspaceApiV1WorkspaceOrganizationCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceOrganizationCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceOwnerCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceOwnerCreate = (
    workspaceId: string,
    request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
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
        useState<IuseWorkspaceApiV1WorkspaceOwnerCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceOwnerCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceResumeCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceResumeCreate = (
    workspaceId: string,
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
        useState<IuseWorkspaceApiV1WorkspaceResumeCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceResumeCreate(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceSuspendCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceSuspendCreate = (
    workspaceId: string,
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
        useState<IuseWorkspaceApiV1WorkspaceSuspendCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceSuspendCreate(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceTierCreateState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspaceTierCreate = (
    workspaceId: string,
    request: GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
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
        useState<IuseWorkspaceApiV1WorkspaceTierCreateState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, request, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceTierCreate(workspaceId, request, params)
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

    if (JSON.stringify([workspaceId, request, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, request, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspaceCurrentListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse
    error?: any
}

export const useWorkspaceApiV1WorkspaceCurrentList = (
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
        useState<IuseWorkspaceApiV1WorkspaceCurrentListState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspaceCurrentList(params)
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

interface IuseWorkspaceApiV1WorkspacesListState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse[]
    error?: any
}

export const useWorkspaceApiV1WorkspacesList = (params: RequestParams = {}) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspacesListState>({
        isLoading: true,
    })
    const [lastInput, setLastInput] = useState<string>(JSON.stringify([params]))

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspacesList(params)
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

interface IuseWorkspaceApiV1WorkspacesDetailState {
    isLoading: boolean
    response?: void
    error?: any
}

export const useWorkspaceApiV1WorkspacesDetail = (
    workspaceId: string,
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

    const [state, setState] = useState<IuseWorkspaceApiV1WorkspacesDetailState>(
        {
            isLoading: true,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspacesDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesByidDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace
    error?: any
}

export const useWorkspaceApiV1WorkspacesByidDetail = (
    workspaceId: string,
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
        useState<IuseWorkspaceApiV1WorkspacesByidDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspacesByidDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesLimitsDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage
    error?: any
}

export const useWorkspaceApiV1WorkspacesLimitsDetail = (
    workspaceName: string,
    query?: {
        ignore_usage?: boolean
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

    const [state, setState] =
        useState<IuseWorkspaceApiV1WorkspacesLimitsDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceName, query, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspacesLimitsDetail(workspaceName, query, params)
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

    if (JSON.stringify([workspaceName, query, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceName, query, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}

interface IuseWorkspaceApiV1WorkspacesLimitsByidDetailState {
    isLoading: boolean
    response?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits
    error?: any
}

export const useWorkspaceApiV1WorkspacesLimitsByidDetail = (
    workspaceId: string,
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
        useState<IuseWorkspaceApiV1WorkspacesLimitsByidDetailState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([workspaceId, params])
    )

    const sendRequest = () => {
        setState({
            ...state,
            isLoading: true,
        })
        try {
            api.workspace
                .apiV1WorkspacesLimitsByidDetail(workspaceId, params)
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

    if (JSON.stringify([workspaceId, params]) !== lastInput) {
        setLastInput(JSON.stringify([workspaceId, params]))
    }

    useEffect(() => {
        sendRequest()
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { error } = state
    return { response, isLoading, error }
}
