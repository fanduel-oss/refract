import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = props => ({ observe }) =>
    observe('username').pipe(
        filter(Boolean),
        debounce(() => timer(1000)),
        flatMap(username =>
            fromPromise(
                fetch(`https://api.github.com/users/${username}`).then(res =>
                    res.json()
                )
            )
        ),
        map(({ message }) => ({
            type: message === 'Not Found' ? 'USERNAME_AVAILABLE' : 'USER_FOUND'
        }))
    )

const handler = ({ setAvailable }) => effect => {
    switch (effect.type) {
        case 'USER_FOUND':
            return setAvailable('false')

        case 'USERNAME_AVAILABLE':
            return setAvailable('true')

        default:
            return setAvailable(null)
    }
}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
