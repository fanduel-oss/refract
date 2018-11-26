import React from 'react'
import { render } from 'react-dom'

import { withEffects, toProps } from 'refract-most'
import { combine, periodic } from 'most'

import Layout from './Layout'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const aperture = component => {
    const [direction$, setDirection] = component.useEvent('direction', 'NONE')
    const tick$ = periodic(1000)
    const count$ = combine(direction => direction, direction$, tick$)
        .scan((count, direction) => count + directions[direction], 0)
        .startWith(0)

    return combine(
        (count, direction) =>
            toProps({
                count,
                direction,
                setDirection
            }),
        count$,
        direction$
    )
}

const LayoutWithEffects = withEffects(aperture)(Layout)

const App = () => <LayoutWithEffects />

render(<App />, document.getElementById('root'))
