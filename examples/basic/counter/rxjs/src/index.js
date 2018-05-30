import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-rxjs'
import { interval } from 'rxjs/observable/interval'
import { withLatestFrom, map } from 'rxjs/operators'

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

    return tick$.pipe(withLatestFrom(direction$), map(([, type]) => ({ type })))
}

const initialState = { count: 0, direction: 'NONE' }

const mapSetStateToProps = { setDirection: direction => ({ direction }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(effectHandler)(effectFactory)(Layout)
)

render(<App />, document.getElementById('root'))
