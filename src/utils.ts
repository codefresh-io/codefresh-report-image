import { GraphQLClient, gql } from 'graphql-request'
import { get } from 'lodash'
export const tryParseJson = (str: string) => {
    try {
        return JSON.parse(str)
    } catch {
        return str
    }
}


/**
 * Build image-report url and headers
 * @param payload
 */
 export async function buildUrlHeaders(payload: Record<string, string | undefined>) {
    const esc = encodeURIComponent
    const headers = { 'authorization': payload['CF_API_KEY']! }
    const runtimeName = payload['CF_RUNTIME_NAME']
    let host
    if (!runtimeName) {
        host = payload['CF_HOST']
        delete payload['CF_HOST']
    }
    else {
        host = getRuntimeIngressHost(runtimeName, headers)
        delete payload['CF_RUNTIME_NAME']
    }
    delete payload['CF_API_KEY']
    const qs = Object.entries(payload).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    const url = `${host}/app-proxy/api/image-report?${qs}`
    if (payload['CF_LOCAL']) {
        return { url: `${host}/api/image-report?${qs}`,  headers }
    }
    return { url, headers }
}


async function getRuntimeIngressHost(runtimeName: string, headers: Record<string, string>, platformHost = 'https://g.codefresh.io'): Promise<string> {
    const graphQLClient = new GraphQLClient(`${platformHost}/2.0/api/graphql`, {
        headers
    })

    const getRuntimeIngressHostQuery = gql`
        query Runtime($name: String!) {
            runtime(name: $name) {
                ingressHost
            }
        }`

    const res = await graphQLClient.request(getRuntimeIngressHostQuery, { name: runtimeName })
    const ingressHost = get(res, 'runtime.ingressHost')
    if (!ingressHost) {
        const message = res.runtime ? `ingress host is not defined on your '${runtimeName}' runtime` : `runtime '${runtimeName}' does not exist`
        throw new errors.ValidationError(`Validation Error: ${message}`)
    }
    return ingressHost
}

export const errors = {
    EventSourceError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'EventSourceError'
        }
    },
    ValidationError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'ValidationError'
        }
    }
}