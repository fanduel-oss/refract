import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-xstream'
import xs from 'xstream'

import Layout from './Layout'

const handler = props => effect => {
    if (effect.type === 'INCREASE') {
        props.setState(({ count }) => ({ count: count + 1 }))
    }

    if (effect.type === 'DECREASE') {
        props.setState(({ count }) => ({ count: count - 1 }))
    }
}

const aperture = props => component => {
    const direction$ = component.observe('direction')

    const tick$ = xs.periodic(1000)

    return xs.combine(direction$, tick$).map(([type]) => ({ type }))
}

const initialState = { count: 0, direction: 'NONE' }

const mapSetStateToProps = { setDirection: direction => ({ direction }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
