import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-most'
import { fromPromise } from 'most'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = ({ observe }) =>
    observe('username')
        .filter(Boolean)
        .debounce(1000)
        .map(username =>
            fromPromise(fetch(`https://api.github.com/users/${username}`))
        )
        .switchLatest()
        .map(response => response.json())
        .awaitPromises()
        .map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))

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
