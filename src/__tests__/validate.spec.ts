import { validate } from '../validate'


describe('client report-image validation', () => {
    it('Must have', async () => {
        try {
            validate({ ENV1: '1', someVal: 'ignored' })
        } catch (error) {
            const expectedErrorMsg = '["CF_API_KEY must be provided as environment variable.","CF_IMAGE must be provided as environment variable.","CF_RUNTIME_NAME must be provided as environment variable."]'
            expect(error.message).toBe(expectedErrorMsg)
            return
        }
        fail(`should have thrown Validation Error`)
    })
    it('not support both CF_HOST and CF_RUNTIME_NAME', async () => {
        try {
            validate({ CF_API_KEY: '1', alsoIgnored: 'ignored', IGNORED: 'ignored too', CF_IMAGE: 'testImage', CF_HOST: `host.io`, CF_RUNTIME_NAME: 'runtime' })
        } catch (error) {
            const expectedErrorMsg = '["You can only specify CF_RUNTIME_NAME or CF_HOST. please delete one of them."]'
            expect(error.message).toBe(expectedErrorMsg)
            return
        }
        fail(`should have thrown Validation Error`)
    })
    it('support CF_HOST', async () => {
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
    it('support CF_RUNTIME_NAME', async () => {
        let res
        try {
            res = validate({ CF_API_KEY: '1', alsoIgnored: 'ignored', IGNORED: 'ignored too', CF_IMAGE: 'testImage', CF_RUNTIME_NAME: `runtime` })
        } catch (error) {
            fail(`should have not thrown an error ${JSON.stringify(error)}`)
        }
        expect(res).toEqual({
            'CF_API_KEY': '1',
            'CF_RUNTIME_NAME': 'runtime',
            'CF_IMAGE': 'testImage'
        })
    })
})
