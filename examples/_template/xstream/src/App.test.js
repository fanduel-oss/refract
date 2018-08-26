import { aperture, handler } from './App'
import xs from 'xstream'

describe('Example', () => {
    const initialProps = {}

    describe('Aperture', () => {
        let mockedComponent

        beforeEach(() => {
            mockedComponent = {
                event: jest.fn().mockReturnValue(xs.from([null])),
                observe: jest.fn().mockReturnValue(xs.from([null])),
                mount: xs.from([undefined]),
                unmount: xs.from([undefined])
            }
        })

        it('should run', () => {
            const effects$ = aperture(initialProps)(mockedComponent)

            expect(typeof effects$.subscribe).toBe('function')
        })
    })

    describe('Effect handler', () => {
        it('should run', () => {
            const effect = {}

            expect(() => handler(initialProps)(effect)).not.toThrow()
        })
    })
})
