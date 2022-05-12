import EventSource from 'eventsource'

import { validate } from './validate'
import { buildUrlHeaders } from './request-builder'


async function main(): Promise<void> {
    const verbose = process.argv.includes('verbose') || process.env['VERBOSE']
    if (verbose) {
        console.debug('Running with verbose log')
    }
    const payload = validate()
    const { url, headers } = buildUrlHeaders(payload, encodeURIComponent)
    if (verbose) {
        console.debug(`Payload: ${JSON.stringify(payload, null, 2)}`)
        console.debug(`Sending request: ${url}, headers: ${JSON.stringify(headers)}`)
    }
    const waitFor = new Promise((resolve, reject) => {
        const eventSource = new EventSource(url, { headers })
        eventSource.addEventListener('report', function (event) {
            console.info(`report =>`, JSON.stringify(JSON.parse(event.data), null, 2))
        })
        eventSource.addEventListener('info', function (event) {
            console.info(`\t\t${JSON.stringify(event.data)}`)
        })
        eventSource.addEventListener('warn', function (event) {
            console.warn(`Warning:\t${JSON.stringify(event.data)}`)
        })
        eventSource.addEventListener('error', (err) => {
            eventSource.close()
            if (err.data) {
                const { error, parameters } = JSON.parse(err.data)
                const message = `Error:\t${error.name}: ${error.message}, parameters provided: ${Object.keys(parameters)}`
                console.error(message)
                reject(new Error(message))
            } else {
                reject(err)
            }
        })
        eventSource.addEventListener('end', (ev) => {
            eventSource.close()
            resolve(ev)
        })
    })
    await waitFor
}

main().then(() => { return }).catch((error) => {
        console.error(error)
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1)
    }
)
