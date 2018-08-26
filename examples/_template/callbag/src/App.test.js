import { aperture, handler } from './App'
import { fromIter } from 'callbag-basics'

describe('Example', () => {
    const initialProps = {}

    describe('Aperture', () => {
        let mockedComponent

        beforeEach(() => {
            mockedComponent = {
                event: jest.fn().mockReturnValue(fromIter([null])),
                observe: jest.fn().mockReturnValue(fromIter([null])),
                mount: fromIter([undefined]),
                unmount: fromIter([undefined])
            }
        })

        it('should run', () => {
            const effects$ = aperture(initialProps)(mockedComponent)

            expect(typeof effects$).toBe('function')
        })
    })

    describe('Effect handler', () => {
        it('should run', () => {
            const effect = {}

            expect(() => handler(initialProps)(effect)).not.toThrow()
        })
    })
})
