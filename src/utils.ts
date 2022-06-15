export const tryParseJson = (str: string) => {
    try {
        return JSON.parse(str)
    } catch {
        return str
    }
}


/**
 * Build image-report url and headers
 * @param payload
 */
 export function buildUrlHeaders(payload: Record<string, string | undefined>) {
    const esc = encodeURIComponent
    const headers = { 'authorization': payload['CF_API_KEY'] }
    const host = payload['CF_HOST'] as string
    delete payload['CF_API_KEY']
    delete payload['CF_HOST']
    const qs = Object.entries(payload).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    const url = `${host}/app-proxy/api/image-report?${qs}`
    if (payload['CF_LOCAL']) {
        return { url: `${host}/api/image-report?${qs}`,  headers }
    }
    return { url, headers }
}


export const errors = {
    EventSourceError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'EventSourceError'
        }
    },
    ValidationError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'ValidationError'
        }
    }
}