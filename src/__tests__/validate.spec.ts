import { validate } from '../validate'


describe('client report-image validation', () => {
    it('Must have', async () => {
        try {
            validate({ ENV1: '1', someVal: 'ignored' })
        } catch (error) {
            expect(error.message).toBe(`Validation Error: ["CF_API_KEY must be provided as environment variable.",` +
                `"CF_IMAGE must be provided as environment variable.",`+
                `"CF_HOST must be provided as app-proxy http/s address TEST"]`)
            return
        }
        fail(`should have thrown Validation Error`)
    })
    it('All OK', async () => {
        let res
        try {
            res = validate({ CF_API_KEY: '1', alsoIgnored: 'ignored', IGNORED: 'ignored too', CF_IMAGE: 'testImage', CF_HOST: `host.io` })
        } catch (error) {
            fail(`should have not thrown an error ${JSON.stringify(error)}`)
        }
        expect(res).toEqual({
            'CF_API_KEY': '1',
            'CF_HOST': 'host.io',
            'CF_IMAGE': 'testImage'
        })
    })
})
