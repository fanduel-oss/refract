import { aperture, handler } from './App'
import xs from 'xstream'
import fromDiagram from 'xstream/extra/fromDiagram'

jest.useFakeTimers()

describe('Example', () => {
    const initialProps = {}

    describe('Aperture', () => {
        let mockedComponent

        beforeEach(() => {
            mockedComponent = {
                observe: jest.fn().mockReturnValue(
                    fromDiagram('i--d--|', {
                        timeUnit: 1000,
                        values: {
                            i: 'INCREASE',
                            d: 'DECREASE'
                        }
                    })
                )
            }
        })

        it('should run', () => {
            const effects$ = aperture(initialProps)(mockedComponent)
            const next = jest.fn()

            const subscription = effects$.subscribe({
                next
            })

            jest.advanceTimersByTime(1000)

            expect(next).toHaveBeenCalledWith({ type: 'INCREASE' })

            jest.advanceTimersByTime(2000)

            expect(next).toHaveBeenCalledWith({ type: 'DECREASE' })

            subscription.unsubscribe()
        })
    })

    describe('Effect handler', () => {
        let initialProps, setState

        beforeEach(() => {
            setState = jest.fn()
            initialProps = {
                setState: callback => setState(callback({ count: 1 }))
            }
        })

        it('should run', () => {
            const effectHandler = handler(initialProps)

            effectHandler({ type: 'DECREASE' })

            expect(setState).toHaveBeenCalledTimes(1)
            expect(setState).toHaveBeenLastCalledWith({ count: 0 })

            effectHandler({ type: 'INCREASE' })

            expect(setState).toHaveBeenCalledTimes(2)
            expect(setState).toHaveBeenLastCalledWith({ count: 2 })

            effectHandler({ type: 'STOP' })

            expect(setState).toHaveBeenCalledTimes(2)
        })
    })
})
