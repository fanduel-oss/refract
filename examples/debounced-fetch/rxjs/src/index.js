import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { timer } from 'rxjs/observable/timer'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = ({ observe }) =>
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

const handler = ({ setData }) => effect => {
    switch (effect.type) {
        case 'USER_DATA_RECEIVE':
            return setData(effect.payload)

        default:
            return
    }
}

const LayoutWithEffects = withEffects(aperture, { handler })(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
