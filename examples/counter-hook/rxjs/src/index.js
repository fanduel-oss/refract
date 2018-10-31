import React, { useState } from 'react'
import { render } from 'react-dom'

import { createRefractHook, toComponent } from './refract-rxjs'
import { combineLatest } from 'rxjs'
import { interval } from 'rxjs/observable/interval'
import { withLatestFrom, map, scan, startWith } from 'rxjs/operators'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const handler = props => effect => {}
const useRefract = createRefractHook(handler)

function App() {
    return <Layout />
}

function Layout() {
    // const [direction, setDirection ] = useState('NONE')
    // const count = 0
    const { count, direction, setDirection } = useRefract(() => component => {
        const [direction$, setDirection] = component.useEvent(
            'direction',
            'NONE'
        )
        const tick$ = interval(1000)
        const count$ = tick$.pipe(
            withLatestFrom(direction$),
            map(([, direction]) => direction),
            scan((count, direction) => count + directions[direction], 0),
            startWith(0)
        )

        return combineLatest(count$, direction$).pipe(
            map(([count, direction]) =>
                toComponent({
                    count,
                    direction,
                    setDirection
                })
            )
        )
    })

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

render(<App />, document.getElementById('root'))
