import React from 'react'
import { render } from 'react-dom'

import { withEffects, toProps } from 'refract-callbag'
import { map, pipe, scan, interval, combine } from 'callbag-basics'
import startWith from 'callbag-start-with'

import Layout from './Layout'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const aperture = initialProps => component => {
    const setDirection = component.pushEvent('direction')
    const direction$ = pipe(component.fromEvent('direction'), startWith('NONE'))
    const tick$ = interval(1000)
    const count$ = pipe(
        combine(tick$, direction$),
        map(args => args[1]),
        scan((count, direction) => count + directions[direction], 0),
        startWith(0)
    )

    return pipe(
        combine(count$, direction$),
        map(([count, direction]) =>
            toProps({
                count,
                direction,
                setDirection
            })
        ),
        startWith(
            toProps({
                count: 0,
                direction: 'NONE',
                setDirection
            })
        )
    )
}

const handler = props => effect => {}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => <LayoutWithEffects />

render(<App />, document.getElementById('root'))
