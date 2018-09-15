import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-callbag'
import fromPromise from 'callbag-from-promise'
import { debounce } from 'callbag-debounce'
import { filter, flatten, map, pipe } from 'callbag-basics'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = props => ({ observe }) =>
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

const handler = ({ setState }) => effect => {
    switch (effect.type) {
        case 'USER_DATA_RECEIVE':
            return setState({ data: effect.payload })

        default:
            return
    }
}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
