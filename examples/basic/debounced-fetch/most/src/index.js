import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-most'
import { fromPromise } from 'most'

import Layout from './Layout'

const handler = ({ setState }) => effect => {
    if (effect.type === 'USER_DATA_RECEIVE') {
        setState({ data: effect.payload })
    }
}

const aperture = () => ({ observe }) =>
    observe('username')
        .filter(Boolean)
        .debounce(1000)
        .flatMap(username =>
            fromPromise(fetch(`https://api.github.com/users/${username}`))
        )
        .map(response => response.json())
        .awaitPromises()
        .map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))

const initialState = { data: null, username: '' }

const mapSetStateToProps = { setUsername: username => ({ username }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
