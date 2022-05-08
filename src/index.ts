import EventSource from 'eventsource'

function filterUppercase(env: Record<string, string|undefined>): Record<string, string|undefined> {
    return Object.keys(env)
        .filter(key => (/^[A-Z_]+$/.test(key)))
        .reduce((obj, key) => {
            obj[key] = env[key];
            return obj;
        }, {});
}


async function main(): Promise<void> {
    const debug = process.argv.includes('debug')
    if (debug) {
        console.debug('Running with debug log')
    }
    const payload = filterUppercase(process.env)
    // using the authentication
    payload['cfApiKey'] = payload['CF_API_KEY']
    if (!payload['CF_API_KEY']) {
        console.error(`CF_API_KEY must be provided as environment variable.`)
    }
    if (!payload['IMAGE']) {
        console.error(`IMAGE must be provided as environment variable.`)
    }
    const cfHost = payload['CF_HOST'] || 'g.codefresh.io'
    const esc = encodeURIComponent;
    const qs = Object.entries(payload).map(kv => `${esc(kv[0])}=${esc(kv[1]||'')}`).join('&')
    const url: string = `${cfHost}/api/image-report?${qs}`
    console.log(`Reporting image to host: ${cfHost}`)
    if (debug) {
        console.debug(`Payload: ${JSON.stringify(payload, null, 2)}`)
        console.debug(`Sending request: ${url}`)
    }
    const waitFor = new Promise((resolve, reject) => {

        const eventSource = new EventSource(url)
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
            const {error, parameters} = JSON.parse(err.data)
            console.error(`Error:\t${error.name}: ${error.message}, parameters provided: ${Object.keys(parameters)}`)
            eventSource.close()
            reject(error)
        })
        eventSource.addEventListener('end', (ev) => {
            eventSource.close()
            resolve(ev)
        })
    })
    await waitFor
}

main().then(()=>{}).catch((err)=>{
    process.exit(1)}
)
