import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-rxjs'
import { interval } from 'rxjs/observable/interval'
import { withLatestFrom, map } from 'rxjs/operators'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = props => component => {
    const direction$ = component.observe('direction')
    const tick$ = interval(1000)

    return tick$.pipe(withLatestFrom(direction$), map(([, type]) => ({ type })))
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
