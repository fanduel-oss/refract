import React from 'react'
import { render } from 'react-dom'

import { withEffects, toProps } from 'refract-rxjs'
import { combineLatest, interval } from 'rxjs'
import { withLatestFrom, map, scan, startWith } from 'rxjs/operators'

import Layout from './Layout'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const aperture = component => {
    const [direction$, setDirection] = component.useEvent('direction', 'NONE')
    const tick$ = interval(1000)
    const count$ = tick$.pipe(
        withLatestFrom(direction$),
        map(([, direction]) => direction),
        scan((count, direction) => count + directions[direction], 0),
        startWith(0)
    )

    return combineLatest(count$, direction$).pipe(
        map(([count, direction]) =>
            toProps({
                count,
                direction,
                setDirection
            })
        )
    )
}

const LayoutWithEffects = withEffects(aperture)(Layout)

const App = () => <LayoutWithEffects />

render(<App />, document.getElementById('root'))
