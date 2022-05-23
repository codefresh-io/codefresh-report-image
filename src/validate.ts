/**
 * Validate mandatory env vars. address host default
 */
export function validate(payload: Record<string, string|undefined>): Record<string, string|undefined> {
    const filtered = filterEnvVarPattern(payload)
    const messages: string[] = []
    if (!filtered['CF_API_KEY']) {
        messages.push(`CF_API_KEY must be provided as environment variable.`)
    }
    if (!filtered['CF_IMAGE']) {
        messages.push(`CF_IMAGE must be provided as environment variable.`)
    }
    if (messages.length>0) {
        throw new Error(`Validation Error: ${JSON.stringify(messages)}`)
    }
    filtered['CF_HOST'] = filtered['CF_HOST'] || 'g.codefresh.io'

    return filtered
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
