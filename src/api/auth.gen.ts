import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse,
    GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey,
    GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTree,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgDescribeApiGetStackFindings,
    GithubComKaytuIoKaytuEnginePkgDescribeApiStack,
    GithubComKaytuIoKaytuEnginePkgInventoryApiAnalyticsCategoriesResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListServicesCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRegionsResourceCountResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceType,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryRequest,
    GithubComKaytuIoKaytuEnginePkgInventoryApiRunQueryResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryHistory,
    GithubComKaytuIoKaytuEnginePkgInventoryApiSmartQueryItem,
    GithubComKaytuIoKaytuEnginePkgMetadataApiSetConfigMetadataRequest,
    GithubComKaytuIoKaytuEnginePkgMetadataModelsConfigMetadata,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCatalogMetrics,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectionGroup,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnectorCount,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCreateSourceResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListCredentialResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAwsRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiSourceAzureRequest,
    GithubComKaytuIoKaytuEnginePkgOnboardApiUpdateCredentialRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceNameRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOrganizationRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceOwnershipRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiChangeWorkspaceTierRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceRequest,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiCreateWorkspaceResponse,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiOrganization,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspace,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimits,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceLimitsUsage,
    GithubComKaytuIoKaytuEnginePkgWorkspaceApiWorkspaceResponse,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseAuthApiV1KeyCreateCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyResponse
    error?: any
}

export const useAuthApiV1KeyCreateCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiCreateAPIKeyRequest,
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1KeyCreateCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1KeyDeleteDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    error?: any
}

export const useAuthApiV1KeyDeleteDelete = (
    id: string,
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([id, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1KeyDeleteDelete(id, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([id, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([id, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1KeysListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceApiKey[]
    error?: any
}

export const useAuthApiV1KeysList = (
    params: RequestParams = {},
    autoExecute = true
) => {
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1KeysList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UserInviteCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserInviteCreate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiInviteRequest,
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UserInviteCreate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UserRoleBindingUpdateState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingUpdate = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiPutRoleBindingRequest,
    params: RequestParams = {},
    autoExecute = true
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
            isExecuted: false,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingUpdate(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UserRoleBindingDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    error?: any
}

export const useAuthApiV1UserRoleBindingDelete = (
    query: {
        userId: string
    },
    params: RequestParams = {},
    autoExecute = true
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
            isExecuted: false,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingDelete(query, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UserRoleBindingsListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetRoleBindingsResponse
    error?: any
}

export const useAuthApiV1UserRoleBindingsList = (
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UserRoleBindingsList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UserDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetUserResponse
    error?: any
}

export const useAuthApiV1UserDetail = (
    userId: string,
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([userId, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UserDetail(userId, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([userId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([userId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1UsersListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersResponse[]
    error?: any
}

export const useAuthApiV1UsersList = (
    request: GithubComKaytuIoKaytuEnginePkgAuthApiGetUsersRequest,
    params: RequestParams = {},
    autoExecute = true
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
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1UsersList(request, params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([request, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([request, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseAuthApiV1WorkspaceRoleBindingsListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgAuthApiWorkspaceRoleBinding[]
    error?: any
}

export const useAuthApiV1WorkspaceRoleBindingsList = (
    params: RequestParams = {},
    autoExecute = true
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
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = () => {
        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            api.auth
                .apiV1WorkspaceRoleBindingsList(params)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    setState({
                        ...state,
                        error: err,
                        response: undefined,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            sendRequest()
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        sendRequest()
    }
    return { response, isLoading, isExecuted, error, sendNow }
}
