// import { buildUrlHeaders } from '../utils'
import * as utils from '../utils'

describe('request builder test', () => {
    beforeEach(() => {
          jest.spyOn(utils, 'getRuntimeIngressHost').mockImplementation(async (runtimeName: string, headers: Record<string, string>) => { return 'fjfjfj'})
    })
    it('support CF_HOST', async () => {
        const { url, headers } = await utils.buildUrlHeaders({
                'CF_API_KEY': 'the-token',
                'CF_HOST': 'https://g.codefresh.io',
                'CF_IMAGE': 'testImage'
            })
        expect(url).toEqual('https://g.codefresh.io/app-proxy/api/image-report?CF_IMAGE=testImage')
        expect(headers).toEqual({ 'authorization': 'the-token' })
    })

    it('support CF_RUNTIME_NAME', async () => {
        const { url, headers } = await utils.buildUrlHeaders({
                'CF_API_KEY': 'the-token',
                'CF_RUNTIME_NAME': 'runtime',
                'CF_IMAGE': 'testImage'
            })
        expect(url).toEqual('https://g.codefresh.io/app-proxy/api/image-report?CF_IMAGE=testImage')
        expect(headers).toEqual({ 'authorization': 'the-token' })
    })

})
