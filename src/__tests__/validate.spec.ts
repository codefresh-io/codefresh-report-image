import { validate } from '../validate'


describe('client report-image validation', () => {
    it('Must have', async () => {
        try {
            validate({ ENV1: '1', someVal: 'ignored' })
        } catch (error) {
            const expectedErrorMsg = 'Validation Error: ["CF_API_KEY must be provided as environment variable.","CF_IMAGE must be provided as environment variable.","CF_RUNTIME_NAME must be provided as environment variable."]'
            expect(error.message).toBe(expectedErrorMsg)
            return
        }
        fail(`should have thrown Validation Error`)
    })
    it('All OK', async () => { //todo: change tests
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
