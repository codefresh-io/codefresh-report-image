/**
 * Validate mandatory env vars. address host default
 */
export function validate(): Record<string, string|undefined> {
    const payload = filterEnvVarPattern(process.env)
    if (!payload['CF_API_KEY']) {
        const message = `CF_API_KEY must be provided as environment variable.`
        console.error(message)
        throw new Error(message)
    }
    if (!payload['CF_IMAGE']) {
        const message = `CF_IMAGE must be provided as environment variable.`
        console.error(message)
        throw new Error(message)
    }
    payload['CF_HOST'] = payload['CF_HOST'] || 'g.codefresh.io'

    return payload
}

/**
 * Filter env for codefresh vars prefix
 * @param env
 */
function filterEnvVarPattern(env: Record<string, string|undefined>): Record<string, string|undefined> {
    return Object.keys(env)
        .filter(key => (/^CF_[A-Z_]+$/.test(key)))
        .reduce((obj, key) => {
            obj[key] = env[key]
            return obj
        }, {})
}
