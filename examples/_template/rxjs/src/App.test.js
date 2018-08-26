import { aperture, handler } from './App'
import { from } from 'rxjs'

describe('Example', () => {
    const initialProps = {}

    describe('Aperture', () => {
        let mockedComponent

        beforeEach(() => {
            mockedComponent = {
                event: jest.fn().mockReturnValue(from([null])),
                observe: jest.fn().mockReturnValue(from([null])),
                mount: from([undefined]),
                unmount: from([undefined])
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
