import React, { useState } from 'react'
import { createRefractHook, toComponent } from './refract-rxjs'
import { combineLatest } from 'rxjs'
import { map, withLatestFrom, scan, startWith } from 'rxjs/operators'
import { interval } from 'rxjs/observable/interval'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const handler = props => effect => {}
const useRefract = createRefractHook(handler)

export default function Counter() {
    const [direction, setDirection] = useState('NONE')
    const count = useRefract(
        () => component => {
            const direction$ = component.observe('direction')
            const tick$ = interval(1000)
            const count$ = tick$.pipe(
                withLatestFrom(direction$),
                map(([, direction]) => direction),
                scan((count, direction) => count + directions[direction], 0),
                startWith(0)
            )

            return combineLatest(count$, direction$).pipe(
                map(([count]) => count),
                map(toComponent)
            )
        },
        { direction }
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
        </div>
    )
}
