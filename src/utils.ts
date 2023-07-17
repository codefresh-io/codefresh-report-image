import { GraphQLClient, gql } from 'graphql-request'
import { get } from 'lodash'
import { gte } from 'semver'

import { deflate } from 'zlib'
import { errors } from './errors'
import { promisify } from 'util'


const deflateAsync = promisify(deflate)

export namespace Utils {
    /**
     * Build image-report url and headers
     * @param payload
     */
     export async function buildUrlHeaders(payload: Record<string, string | undefined>): Promise<{ url: string, headers: { authorization: string } }> {
        const headers = { 'authorization': payload['CF_API_KEY']! }
        const runtimeName = payload['CF_RUNTIME_NAME']
        const platformHost = payload['CF_PLATFORM_URL']
        let host
        if (!runtimeName) {
            host = payload['CF_HOST']
            delete payload['CF_HOST']
        } else {
            host = await Utils.getRuntimeIngressHost(runtimeName, headers, platformHost)
            delete payload['CF_RUNTIME_NAME']
            delete payload['CF_PLATFORM_URL']
        }
        delete payload['CF_API_KEY']
        const qs = await this.getQueryString(payload, headers, platformHost, runtimeName)
        const url = `${host}/app-proxy/api/image-report?${qs}`
        if (payload['CF_LOCAL']) {
            return { url: `${host}/api/image-report?${qs}`, headers }
        }
        return { url, headers }
    }

    export async function getRuntimeIngressHost(runtimeName: string, headers: Record<string, string>, platformHost = 'https://g.codefresh.io'): Promise<string> {
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
            throw new errors.ValidationError(message)
        }
        return ingressHost
    }

    export async function getRuntimeVersion(headers: Record<string, string>, runtimeName?: string, platformHost = 'https://g.codefresh.io'): Promise<string> {
        if (!runtimeName) {
            return ''
        }
        const graphQLClient = new GraphQLClient(`${platformHost}/2.0/api/graphql`, {
            headers
        })
        const getRuntimeIngressHostQuery = gql`
            query Runtime($name: String!) {
                runtime(name: $name) {
                    runtimeVersion
                }
            }`
        const res = await graphQLClient.request(getRuntimeIngressHostQuery, { name: runtimeName })
        return get(res, 'runtime.runtimeVersion', '')
    }

    export async function getQueryString(payload: Record<string, string | undefined>, headers: any, platformHost: string, runtimeName?: string): Promise<string> {
         const esc = encodeURIComponent
         if (runtimeName) {
            const runtimeVersion = await Utils.getRuntimeVersion(headers, runtimeName, platformHost)
            const shouldCompressData = gte(runtimeVersion, '0.0.553')
            if (shouldCompressData) {
                const dockerfile = payload['CF_DOCKERFILE_CONTENT']
                if (dockerfile) {
                    const compressedDockerfile = await deflateAsync(Buffer.from(dockerfile, 'base64'), { level: 9, strategy: 0 })
                    delete payload['CF_DOCKERFILE_CONTENT']
                    payload['CF_DOCKERFILE_CONTENT'] = compressedDockerfile.toString('base64')
                }
                const qs = Object.entries(payload).map(kv => `${kv[0]}=${kv[1] || ''}`).join('&')
                const compressedPayload = await deflateAsync(Buffer.from(qs), { level: 9, strategy: 0 })
                const data = compressedPayload.toString('base64')
                return `data=${esc(data)}`
            }
        }
        return Object.entries(payload).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    }

    export function tryParseJson (str: string) {
        try {
            return JSON.parse(str)
        } catch {
            return str
        }
    }

    export type Timer = {
        timeoutTime: number,
        restart: (timeoutMs?: number) => void,
        stop: () => void,
    }

    export function createHeartbeatTimer(cb: () => void, timeoutTime: number): Timer {
        let timeout: NodeJS.Timeout = setTimeout(cb, timeoutTime)

        return {
            timeoutTime,
            restart(_timeoutMs?: number) {
                this.stop()
                timeout = setTimeout(cb, _timeoutMs || this.timeoutTime)
            },
            stop() {
                clearTimeout(timeout)
            }
        }
    }
}

