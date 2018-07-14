import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'

import Layout from './Layout'

const handler = ({ setAvailable }) => effect => {
    if (effect.type === 'USER_FOUND') {
        setAvailable('false')
    } else if (effect.type === 'USERNAME_AVAILABLE') {
        setAvailable('true')
    } else {
        setAvailable(null)
    }
}

const aperture = () => ({ observe }) =>
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

const initialState = { available: null, username: '' }

const mapSetStateToProps = {
    setAvailable: available => ({ available }),
    setUsername: username => ({ available: null, username })
}

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
