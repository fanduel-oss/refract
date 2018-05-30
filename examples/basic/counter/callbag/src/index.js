import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-callbag'
import interval from 'callbag-interval'
import combine from 'callbag-combine'
import { map, pipe } from 'callbag-basics'

import Layout from './Layout'

const effectHandler = props => effect => {
    if (effect.type === 'INCREASE') {
        props.setState(({ count }) => ({ count: count + 1 }))
    }

    if (effect.type === 'DECREASE') {
        props.setState(({ count }) => ({ count: count - 1 }))
    }
}

const effectFactory = props => component => {
    const direction$ = component.observe('direction')

    const tick$ = interval(1000)

    return pipe(combine(tick$, direction$), map(([, type]) => ({ type })))
}

const initialState = { count: 0, direction: 'NONE' }

const mapSetStateToProps = { setDirection: direction => ({ direction }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(effectHandler)(effectFactory)(Layout)
)

render(<App />, document.getElementById('root'))
