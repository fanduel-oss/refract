import React, { useState, useEffect } from 'react'
import { createRefractHook, toComponent } from './refract-rxjs'
import { combineLatest } from 'rxjs'
import { map, withLatestFrom, scan, startWith } from 'rxjs/operators'
import { interval } from 'rxjs/observable/interval'

const useInterval = ms => {
    const [tick, setTick] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(tick + 1)
        }, ms)

        return () => clearInterval(interval)
    })

    return tick
}

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const handler = props => effect => {}
const useRefract = createRefractHook(handler)

export default function Counter() {
    const externalTick = useInterval(500)

    const { count, direction, setDirection } = useRefract(
        () => component => {
            const [direction$, setDirection] = component.useEvent(
                'direction',
                'NONE'
            )
            const tick$ = interval(1000)
            const externalTick$ = component.observe(
                'externalTick',
                val => val / 2
            )
            const count$ = tick$.pipe(
                withLatestFrom(direction$),
                map(([, direction]) => direction),
                scan((count, direction) => count + directions[direction], 0),
                startWith(0)
            )

            return combineLatest(count$, direction$, externalTick$).pipe(
                map(([count, direction, externalTick]) =>
                    toComponent({
                        count,
                        direction,
                        setDirection,
                        externalTick
                    })
                )
            )
        },
        { externalTick }
    )

    return (
        <div>
            <p>Current count: {count}</p>
            <p>Current direction: {direction}</p>
            <p>
                <button
                    className={direction === 'INCREASE' ? 'active' : undefined}
                    onClick={() => setDirection('INCREASE')}
                >
                    Increase
                </button>
                <button
                    className={direction === 'NONE' ? 'active' : undefined}
                    onClick={() => setDirection('NONE')}
                >
                    Pause
                </button>
                <button
                    className={direction === 'DECREASE' ? 'active' : undefined}
                    onClick={() => setDirection('DECREASE')}
                >
                    Decrease
                </button>
            </p>
            <p>External tick: {externalTick}</p>
        </div>
    )
}
