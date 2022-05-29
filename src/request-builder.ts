/**
 * Build image-report url and headers
 * @param payload
 */
export function buildUrlHeaders(payload: Record<string, string | undefined>) {
    const esc = encodeURIComponent
    const headers = { 'authorization': payload['CF_API_KEY'] }
    const host = payload['CF_HOST']
    delete payload['CF_API_KEY']
    delete payload['CF_HOST']
    const qs = Object.entries(payload).map(kv => `${esc(kv[0])}=${esc(kv[1] || '')}`).join('&')
    const url = `${host}/api/image-report?${qs}`
    return { url, headers }
}
