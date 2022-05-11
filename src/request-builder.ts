
function cleanThePrefixCF(env: Record<string, string|undefined>): Record<string, string|undefined> {
    return Object.keys(env)
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce((obj, key) => {
            const k = key.replace(/^CF_/, '')
            obj[k] = env[key]
            return obj
        }, {})
}

export function buildUrlHeaders(payload: Record<string, string | undefined>, esc: (uriComponent: (string | number | boolean)) => string) {
    const parameters = cleanThePrefixCF(payload)
    const headers = { 'authorization': parameters['API_KEY'] }
    const host = parameters['HOST']
    delete parameters['API_KEY']
    delete parameters['HOST']
    const qs = Object.entries(parameters).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    const url = `${host}/api/image-report?${qs}`
    return { url, headers }
}
