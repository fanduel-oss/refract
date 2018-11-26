import React from 'react'
import { render } from 'react-dom'

import { withEffects, toProps } from 'refract-xstream'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import Layout from './Layout'

const directions = {
    INCREASE: 1,
    DECREASE: -1,
    NONE: 0
}

const aperture = component => {
    const [direction$, setDirection] = component.useEvent('direction', 'NONE')
    const tick$ = xs.periodic(1000)
    const count$ = tick$
        .compose(sampleCombine(direction$))
        .map(([, direction]) => direction)
        .fold((count, direction) => count + directions[direction], 0)
        .startWith(0)

    return xs.combine(count$, direction$).map(([count, direction]) =>
        toProps({
            count,
            direction,
            setDirection
        })
    )
}

const LayoutWithEffects = withEffects(aperture)(Layout)

const App = () => <LayoutWithEffects />

render(<App />, document.getElementById('root'))
