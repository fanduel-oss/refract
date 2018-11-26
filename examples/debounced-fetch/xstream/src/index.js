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
        .map(payload => ({ type: 'USER_DATA_RECEIVE', payload }))

const handler = ({ setState }) => effect => {
    switch (effect.type) {
        case 'USER_DATA_RECEIVE':
            return setState({ data: effect.payload })

        default:
            return
    }
}

const LayoutWithEffects = withEffects(aperture, { handler })(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
