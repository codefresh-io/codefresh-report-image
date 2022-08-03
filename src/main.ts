import EventSource from 'eventsource'

import { validate } from './validate'
import { Utils }  from './utils'
import {  errors } from './errors'
import { logger, workflowLogger } from './logger'

const { EventSourceError } = errors


/**
 * Take (CF_ prefixed) Env variables and perform http/s request (SSE) to app-proxy for image-report with CF_ENRICHERS
 */
async function main(argv, env): Promise<void> {
    const verbose = argv.includes('verbose') || env['VERBOSE']
    if (verbose) {
        logger.debug('running with verbose log')
    }
    const payload = validate(env)
    const { url, headers } = await Utils.buildUrlHeaders(payload)
    if (verbose) {
        logger.debug(`payload: ${JSON.stringify(payload, null, 2)}`)
        logger.debug(`sending request: ${url}, headers: ${JSON.stringify(headers)}`)
    }
    if (payload['CF_CI_TYPE'] && payload['CF_WORKFLOW_URL']) {
        logger.info(`CI provider: ${payload['CF_CI_TYPE']}, job URL: ${payload['CF_WORKFLOW_URL']}`)
    }
    const eventSource = new EventSource(url, { headers })
    eventSource.reconnectInterval = 1000*10000 // prevent retry. client should not issue a reconnect
    const waitFor = new Promise<void>((resolve, reject) => {
        
        eventSource.addEventListener('report', function (event) {
            logger.info(JSON.stringify(JSON.parse(event.data), null, 2))
        })
        eventSource.addEventListener('info', function (event) {
            logger.info(event.data)
        })
        eventSource.addEventListener('warn', function (event) {
            logger.warn(event.data)
        })
        eventSource.addEventListener('workflow-log', function (event) {
            const log = Utils.tryParseJson(event.data)
            if (typeof log === 'object' && log.content && log.podName) {
                workflowLogger.info({ pod: log.podName, message: log.content })
            } else {
                workflowLogger.info(event.data)
            }
        })
        eventSource.addEventListener('error', (errorEvent) => {
            eventSource.close()

            const error = Utils.tryParseJson(errorEvent.data)
            let name
            let message
            if (typeof error === 'string') {
                message = error
            } else if (typeof error === 'object') {
                if (typeof error.message === 'string') {
                    message = error.message
                }
                if (typeof error.name === 'string') {
                    name = error.name
                }
            } else {
                message = errorEvent.message || `Unknown error. Something went wrong. ${JSON.stringify(errorEvent)}`
            }
            reject(new EventSourceError(message, name))
        })
        eventSource.addEventListener('end', (event) => {
            eventSource.close()
            logger.info(event.data)
            resolve()
        })
    })
    await waitFor
}

/**
 * calling main with process argv and env. Exit code 1 on error
 */
export async function mainErrorHandling() {
    try {
        await main(process.argv, process.env)
    } catch (error) {
        logger.error(error.toString())
        process.exit(1)
    }
}
