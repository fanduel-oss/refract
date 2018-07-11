import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'

import Layout from './Layout'

const handler = ({ setState }) => effect => {
    console.log(effect)
    if (effect.type === 'USER_DATA_RECEIVE') {
        setState({ data: effect.payload })
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
        map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))
    )

const initialState = { data: null, username: '' }

const mapSetStateToProps = { setUsername: username => ({ username }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
