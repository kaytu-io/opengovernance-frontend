import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetServicesFindingsSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsight,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup,
    GithubComKaytuIoKaytuEnginePkgComplianceApiAssignedBenchmark,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFindingKPIResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment,
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiListResourceFindingsResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkRemediation,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiListResourceFindingsRequest,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetAccountsFindingsSummaryResponse,
    GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint,
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'

interface IuseComplianceApiV1AiControlRemediationCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkRemediation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AiControlRemediationCreate = (
    controlId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AiControlRemediationCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([controlId, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AiControlRemediationCreate(controlId, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([controlId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([controlId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1AssignmentsBenchmarkDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedEntities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsBenchmarkDetail = (
    benchmarkId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsBenchmarkDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AssignmentsBenchmarkDetail(benchmarkId, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([benchmarkId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([benchmarkId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1AssignmentsConnectionDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiAssignedBenchmark[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDetail = (
    connectionId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([connectionId, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AssignmentsConnectionDetail(connectionId, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([connectionId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([connectionId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1AssignmentsResourceCollectionDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiAssignedBenchmark[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsResourceCollectionDetail = (
    resourceCollectionId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsResourceCollectionDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([resourceCollectionId, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AssignmentsResourceCollectionDetail(
                    resourceCollectionId,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([resourceCollectionId, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([resourceCollectionId, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1AssignmentsConnectionCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignment[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionCreate = (
    benchmarkId: string,
    query?: {
        auto_assign?: boolean

        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AssignmentsConnectionCreate(
                    benchmarkId,
                    query,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1AssignmentsConnectionDeleteState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1AssignmentsConnectionDelete = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1AssignmentsConnectionDeleteState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1AssignmentsConnectionDelete(
                    benchmarkId,
                    query,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1BenchmarksSummaryListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetBenchmarksSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksSummaryList = (
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        tag?: string[]

        timeAt?: number

        topAccountCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksSummaryListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1BenchmarksSummaryList(query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1BenchmarksControlsDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkControlSummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksControlsDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksControlsDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1BenchmarksControlsDetail(benchmarkId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1BenchmarksControlsDetail2State {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksControlsDetail2 = (
    benchmarkId: string,
    controlId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksControlsDetail2State>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, controlId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1BenchmarksControlsDetail2(
                    benchmarkId,
                    controlId,
                    query,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, controlId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([benchmarkId, controlId, query, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1BenchmarksSummaryDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksSummaryDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        timeAt?: number

        topAccountCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksSummaryDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1BenchmarksSummaryDetail(benchmarkId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1BenchmarksTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1BenchmarksTrendDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1BenchmarksTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1BenchmarksTrendDetail(benchmarkId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1ControlsSummaryListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1ControlsSummaryList = (
    query?: {
        controlId?: string[]

        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1ControlsSummaryListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1ControlsSummaryList(query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1ControlsSummaryDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1ControlsSummaryDetail = (
    controlId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1ControlsSummaryDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([controlId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1ControlsSummaryDetail(controlId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([controlId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([controlId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1ControlsTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiControlTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1ControlsTrendDetail = (
    controlId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        startTime?: number

        endTime?: number

        granularity?: 'daily' | 'monthly'
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1ControlsTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([controlId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1ControlsTrendDetail(controlId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([controlId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([controlId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiGetFindingsRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1FindingsCreateState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsCreate(request, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsFiltersCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFiltersWithMetadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsFiltersCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingFilters,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsFiltersCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsFiltersCreate(request, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsKpiListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiFindingKPIResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsKpiList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1FindingsKpiListState>(
        {
            isLoading: true,
            isExecuted: false,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsKpiList(paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsResourceCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsResourceCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiGetSingleResourceFindingRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsResourceCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsResourceCreate(request, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsTopDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsTopDetail = (
    field:
        | 'resourceType'
        | 'connectionID'
        | 'resourceID'
        | 'service'
        | 'controlID',
    count: number,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        benchmarkId?: string[]

        controlId?: string[]

        severities?: ('none' | 'low' | 'medium' | 'high' | 'critical')[]

        conformanceStatus?: ('ok' | 'alarm' | 'info' | 'skip' | 'error')[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsTopDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([field, count, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsTopDetail(field, count, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([field, count, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([field, count, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsAccountsDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetAccountsFindingsSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsAccountsDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsAccountsDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsAccountsDetail(benchmarkId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsServicesDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetServicesFindingsSummaryResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsServicesDetail = (
    benchmarkId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsServicesDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsServicesDetail(benchmarkId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, query, params, autoExecute]) !== lastInput
    ) {
        setLastInput(JSON.stringify([benchmarkId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1FindingsCountDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1FindingsCountDetail = (
    benchmarkId: string,
    field: 'resourceType' | 'connectionID' | 'resourceID' | 'service',
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        severities?: ('none' | 'low' | 'medium' | 'high' | 'critical')[]
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1FindingsCountDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([benchmarkId, field, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1FindingsCountDetail(
                    benchmarkId,
                    field,
                    query,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([benchmarkId, field, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([benchmarkId, field, query, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1InsightListState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightList(query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightGroupListState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupList = (
    query?: {
        tag?: string[]

        connector?: ('' | 'AWS' | 'Azure')[]

        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightGroupList(query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightGroupDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightGroup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupDetail = (
    insightGroupId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightGroupDetail(insightGroupId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([insightGroupId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([insightGroupId, query, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightGroupTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightGroupTrendDetail = (
    insightGroupId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightGroupTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightGroupId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightGroupTrendDetail(
                    insightGroupId,
                    query,
                    paramsSignal
                )
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (
        JSON.stringify([insightGroupId, query, params, autoExecute]) !==
        lastInput
    ) {
        setLastInput(
            JSON.stringify([insightGroupId, query, params, autoExecute])
        )
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1InsightDetailState>({
        isLoading: true,
        isExecuted: false,
    })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightDetail(insightId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([insightId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1InsightTrendDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsightTrendDatapoint[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1InsightTrendDetail = (
    insightId: string,
    query?: {
        connectionId?: string[]

        connectionGroup?: string[]

        resourceCollection?: string[]

        startTime?: number

        endTime?: number

        datapointCount?: number
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1InsightTrendDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1InsightTrendDetail(insightId, query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([insightId, query, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, query, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1MetadataInsightDetailState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiInsight
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataInsightDetail = (
    insightId: string,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataInsightDetailState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([insightId, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1MetadataInsightDetail(insightId, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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

    if (JSON.stringify([insightId, params, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([insightId, params, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1MetadataTagComplianceListState {
    isLoading: boolean
    isExecuted: boolean
    response?: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataTagComplianceList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagComplianceListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1MetadataTagComplianceList(paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1MetadataTagInsightListState {
    isLoading: boolean
    isExecuted: boolean
    response?: Record<string, string[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1MetadataTagInsightList = (
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1MetadataTagInsightListState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1MetadataTagInsightList(paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1QueriesSyncListState {
    isLoading: boolean
    isExecuted: boolean
    response?: void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1QueriesSyncList = (
    query?: {
        configzGitURL?: string
    },
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] = useState<IuseComplianceApiV1QueriesSyncListState>(
        {
            isLoading: true,
            isExecuted: false,
        }
    )
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([query, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1QueriesSyncList(query, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}

interface IuseComplianceApiV1ResourceFindingsCreateState {
    isLoading: boolean
    isExecuted: boolean
    response?: GithubComKaytuIoKaytuEnginePkgComplianceApiListResourceFindingsResponse
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: any
}

export const useComplianceApiV1ResourceFindingsCreate = (
    request: GithubComKaytuIoKaytuEnginePkgComplianceApiListResourceFindingsRequest,
    params: RequestParams = {},
    autoExecute = true
) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<IuseComplianceApiV1ResourceFindingsCreateState>({
            isLoading: true,
            isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([request, params, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
        if (!api.instance.defaults.headers.common.Authorization) {
            return
        }

        setState({
            ...state,
            error: undefined,
            isLoading: true,
            isExecuted: true,
        })
        try {
            if (workspace !== undefined && workspace.length > 0) {
                setWorkspace(workspace)
            } else {
                setWorkspace('kaytu')
            }

            const paramsSignal = { ...params, signal: abortCtrl.signal }
            api.compliance
                .apiV1ResourceFindingsCreate(request, paramsSignal)
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
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
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
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
        controller.abort()
        const newController = new AbortController()
        setController(newController)
        sendRequest(newController)
    }
    return { response, isLoading, isExecuted, error, sendNow }
}
