import { Utils } from '../utils'

describe('request builder test', () => {
    it('support CF_HOST', async () => {
        const { url, headers } = await Utils.buildUrlHeaders({
                'CF_API_KEY': 'the-token',
                'CF_HOST': 'https://g.codefresh.io',
                'CF_IMAGE': 'testImage'
            })
        expect(url).toEqual('https://g.codefresh.io/app-proxy/api/image-report?CF_IMAGE=testImage')
        expect(headers).toEqual({ 'authorization': 'the-token' })
    })

    it('support CF_RUNTIME_NAME', async () => {
        const ingressHost = 'https://my.codefresh.ingress'
        jest.spyOn(Utils, 'getRuntimeIngressHost').mockResolvedValue(ingressHost)
        const { url, headers } = await Utils.buildUrlHeaders({
                'CF_API_KEY': 'the-token',
                'CF_RUNTIME_NAME': 'runtime',
                'CF_IMAGE': 'testImage'
            })
        expect(url).toEqual(`${ingressHost}/app-proxy/api/image-report?CF_IMAGE=testImage`)
        expect(headers).toEqual({ 'authorization': 'the-token' })
    })

})
