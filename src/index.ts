import EventSource from 'eventsource'

function validate(): Record<string, string|undefined> {
    const payload = filterEnvVarPattern(process.env)
    if (!payload['CF_API_KEY']) {
        const message = `CF_API_KEY must be provided as environment variable.`;
        console.error(message)
        throw new Error(message)
    }
    if (!payload['CF_IMAGE']) {
        const message = `CF_IMAGE must be provided as environment variable.`;
        console.error(message)
        throw new Error(message)
    }
    payload['CF_HOST'] = payload['CF_HOST'] || 'g.codefresh.io'

    return payload
}

function filterEnvVarPattern(env: Record<string, string|undefined>): Record<string, string|undefined> {
    return Object.keys(env)
        .filter(key => (/^CF_[A-Z_]+$/.test(key)))
        .reduce((obj, key) => {
            obj[key] = env[key];
            return obj;
        }, {});
}

function cleanThePrefixCF(env: Record<string, string|undefined>): Record<string, string|undefined> {
    return Object.keys(env)
        .reduce((obj, key) => {
            const k = key.replace(/^CF_/,"");
            obj[k] = env[key];
            return obj;
        }, {});
}

function buildUrlHeaders(parameters: Record<string, string | undefined>, esc: (uriComponent: (string | number | boolean)) => string) {
    const headers = { 'authorization' : parameters['API_KEY']}
    const host = parameters['HOST']
    delete parameters['API_KEY']
    delete parameters['HOST']
    const qs = Object.entries(parameters).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    const url: string = `${host}/api/image-report?${qs}`
    return {url, headers}
}

async function main(): Promise<void> {
    const verbose = process.argv.includes('verbose')
    if (verbose) {
        console.debug('Running with verbose log')
    }
    const payload = validate()
    const {url, headers} = buildUrlHeaders(cleanThePrefixCF(payload), encodeURIComponent);
    if (verbose) {
        console.debug(`Payload: ${JSON.stringify(payload, null, 2)}`)
        console.debug(`Sending request: ${url}, headers: ${JSON.stringify(headers)}`)
    }
    const waitFor = new Promise((resolve, reject) => {
        const eventSource = new EventSource(url, {headers})
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
                const {error, parameters} = JSON.parse(err.data)
                const message = `Error:\t${error.name}: ${error.message}, parameters provided: ${Object.keys(parameters)}`;
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

main().then(()=>{}).catch((err)=>{
    console.error(err)
    process.exit(1)}
)
