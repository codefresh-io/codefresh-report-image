import { errors } from './errors'

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
    if (!filtered['CF_RUNTIME_NAME'] && !filtered['CF_HOST'] ) {
        messages.push(`CF_RUNTIME_NAME must be provided as environment variable.`)
    }
    if (filtered['CF_RUNTIME_NAME'] && filtered['CF_HOST'] ) {
        messages.push(`You can only specify CF_RUNTIME_NAME or CF_HOST. please delete one of them.`)
    }
    if (messages.length > 0) {
        throw new errors.ValidationError(`${JSON.stringify(messages)}`)
    }

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
            if (env[key]) { // skip empty
                obj[key] = env[key]
            }
            return obj
        }, {})
}
