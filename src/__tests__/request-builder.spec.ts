import { buildUrlHeaders } from '../utils'


describe('request builder test', () => {
    it('not clean CF_', async () => { //todo: change tests
        const
            { url, headers } = await buildUrlHeaders({
                'CF_API_KEY': 'the-token',
                'CF_HOST': 'https://g.codefresh.io',
                // 'CF_RUNTIME_NAME': 'codefresh-hosted',
                'CF_IMAGE': 'testImage'
            })
        expect(url).toEqual('https://g.codefresh.io/app-proxy/api/image-report?CF_IMAGE=testImage')
        expect(headers).toEqual({ 'authorization': 'the-token' })
    })

})
