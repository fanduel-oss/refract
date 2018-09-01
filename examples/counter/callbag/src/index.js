import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-callbag'
import interval from 'callbag-interval'
import combine from 'callbag-combine'
import { map, pipe } from 'callbag-basics'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = props => component => {
    const direction$ = component.observe('direction')
    const tick$ = interval(1000)

    const combined$ = combine(direction$, tick$)

    return pipe(combined$, map(([type]) => ({ type })))
}

const handler = props => effect => {
    switch (effect.type) {
        case 'DECREASE':
            return props.setState(({ count }) => ({ count: count - 1 }))

        case 'INCREASE':
            return props.setState(({ count }) => ({ count: count + 1 }))

        default:
            return
    }
}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
