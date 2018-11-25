import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-xstream'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = ({ observe }) =>
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

const LayoutWithEffects = withEffects(aperture, { handler })(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
