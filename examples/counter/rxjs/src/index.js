import React from 'react'
import { render } from 'react-dom'

import { withEffects, toProps } from 'refract-rxjs'
import { combineLatest } from 'rxjs'
import { interval } from 'rxjs/observable/interval'
import { withLatestFrom, map, scan, startWith } from 'rxjs/operators'

import Layout from './Layout'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const aperture = initialProps => component => {
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

const handler = props => effect => {}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => <LayoutWithEffects />

render(<App />, document.getElementById('root'))
