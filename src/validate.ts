import { errors } from './utils'
import { atob } from 'buffer'

/**
 * Validate mandatory env vars. address host default
 */
export function validate(payload: Record<string, string|undefined>): Record<string, string|undefined> {
    if (payload['EXTERNAL_ENV']) {
        try {
            payload = JSON.parse(atob(payload['EXTERNAL_ENV']))
        } catch (error) {
            console.log(`could not handle ${JSON.stringify(payload['EXTERNAL_ENV'])} , Error ${JSON.stringify(error)}  `)
        }
    }
    const filtered = filterEnvVarPattern(payload)
    const messages: string[] = []
    if (!filtered['CF_API_KEY']) {
        messages.push(`CF_API_KEY must be provided as environment variable.`)
    }
    if (!filtered['CF_IMAGE']) {
        messages.push(`CF_IMAGE must be provided as environment variable.`)
    }
    if (!filtered['CF_HOST']) {
        messages.push(`CF_HOST must be provided as app-proxy http/s address`)
    }
    if (messages.length > 0) {
        throw new errors.ValidationError(`Validation Error: ${JSON.stringify(messages)}`)
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
