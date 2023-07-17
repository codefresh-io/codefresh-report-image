import { GraphQLClient, gql } from 'graphql-request'
import { get } from 'lodash'
import { gte } from 'semver'

import { deflate } from 'zlib'
import { errors } from './errors'
import { promisify } from 'util'
import { logger } from './logger'


const deflateAsync = promisify(deflate)

export namespace Utils {
    /**
     * Build image-report url and headers
     * @param payload
     */
     export async function buildUrlHeaders(payload: Record<string, string | undefined>): Promise<{ url: string, headers: { authorization: string } }> {
        const headers = { 'authorization': payload['CF_API_KEY']! }
        const runtimeName = payload['CF_RUNTIME_NAME']
        let host
        let runtimeVersion
        if (!runtimeName) {
            host = payload['CF_HOST']
            delete payload['CF_HOST']
        } else {
            const platformHost = payload['CF_PLATFORM_URL'] || 'https://g.codefresh.io'
            const runtimeInfo = await Utils.getRuntimeInfo(runtimeName, headers, platformHost)
            host = runtimeInfo.ingressHost
            runtimeVersion = runtimeInfo.runtimeVersion
            delete payload['CF_RUNTIME_NAME']
            delete payload['CF_PLATFORM_URL']
        }
        delete payload['CF_API_KEY']
        let qs
        const shouldCompressData = runtimeVersion && gte(runtimeVersion, '0.0.553')
        if (shouldCompressData) {
            logger.info('Used new logic to send variables')
            qs = await this.getQueryStringCompressed(payload)
        } else {
            qs = await this.getQueryString(payload)
        }

        const url = `${host}/app-proxy/api/image-report?${qs}`
        if (payload['CF_LOCAL']) {
            return { url: `${host}/api/image-report?${qs}`, headers }
        }
        return { url, headers }
    }

    export async function getRuntimeInfo(runtimeName: string, headers: Record<string, string>, platformHost): Promise<{ ingressHost: string, runtimeVersion: string }> {
        const graphQLClient = new GraphQLClient(`${platformHost}/2.0/api/graphql`, {
            headers
        })

        const getRuntimeIngressHostQuery = gql`
            query Runtime($name: String!) {
                runtime(name: $name) {
                    ingressHost,
                    runtimeVersion
                }
            }`

        const res = await graphQLClient.request(getRuntimeIngressHostQuery, { name: runtimeName })
        const ingressHost = get(res, 'runtime.ingressHost')
        const runtimeVersion = get(res, 'runtime.runtimeVersion', '')
        if (!ingressHost) {
            const message = res.runtime ? `ingress host is not defined on your '${runtimeName}' runtime` : `runtime '${runtimeName}' does not exist`
            throw new errors.ValidationError(message)
        }
        return { ingressHost, runtimeVersion }
    }

    export async function getQueryStringCompressed(payload: Record<string, string | undefined>): Promise<string> {
        logger.debug('Start encoding variables')
        const dockerfile = payload['CF_DOCKERFILE_CONTENT']
        if (dockerfile) {
            const compressedDockerfile = await deflateAsync(Buffer.from(dockerfile, 'base64'), { level: 9, strategy: 0 })
            payload['CF_DOCKERFILE_CONTENT'] = compressedDockerfile.toString('base64')
        }
        const qsNoEscaping = Object.entries(payload).map(kv => `${kv[0]}=${kv[1] || ''}`).join('&')
        const compressedPayload = await deflateAsync(Buffer.from(qsNoEscaping), { level: 9, strategy: 0 })
        const data = compressedPayload.toString('base64')
        logger.debug('Variables successfully encoded')
        return `data=${encodeURIComponent(data)}`
    }

    export async function getQueryString(payload: Record<string, string | undefined>) {
        return Object.entries(payload).map(kv => `${encodeURIComponent(kv[0])}=${encodeURIComponent(kv[1] || '')}`).join('&')
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

