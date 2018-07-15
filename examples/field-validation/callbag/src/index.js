import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-callbag'
import fromPromise from 'callbag-from-promise'
import { debounce } from 'callbag-debounce'
import { filter, flatten, map, pipe } from 'callbag-basics'

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
    pipe(
        observe('username'),
        filter(Boolean),
        debounce(1000),
        map(username =>
            fromPromise(
                fetch(`https://api.github.com/users/${username}`).then(res =>
                    res.json()
                )
            )
        ),
        flatten,
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
