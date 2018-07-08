import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-callbag'
import fromPromise from 'callbag-from-promise'
import { debounce } from 'callbag-debounce'
import { filter, flatten, map, pipe } from 'callbag-basics'

import Layout from './Layout'

const handler = ({ setState }) => effect => {
    if (effect.type === 'USER_DATA_RECEIVE') {
        setState({ data: effect.payload })
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
        map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))
    )

const initialState = { data: null, username: '' }

const mapSetStateToProps = { setUsername: username => ({ username }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
