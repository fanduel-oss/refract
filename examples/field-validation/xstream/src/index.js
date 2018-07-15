import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-xstream'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

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
    observe('username')
        .filter(Boolean)
        .compose(debounce(1000))
        .map(username =>
            xs.fromPromise(
                fetch(`https://api.github.com/users/${username}`).then(res =>
                    res.json()
                )
            )
        )
        .flatten()
        .map(({ message }) => ({
            type: message === 'Not Found' ? 'USERNAME_AVAILABLE' : 'USER_FOUND'
        }))

const initialState = { available: null, username: '' }

const mapSetStateToProps = {
    setAvailable: available => ({ available }),
    setUsername: username => ({ available: null, username })
}

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
