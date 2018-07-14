import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-xstream'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import Layout from './Layout'

const handler = ({ setState }) => effect => {
    console.log(effect)
    if (effect.type === 'USER_DATA_RECEIVE') {
        setState({ data: effect.payload })
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
        .map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))

const initialState = { data: null, username: '' }

const mapSetStateToProps = { setUsername: username => ({ username }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
