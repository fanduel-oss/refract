import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-most'
import { fromPromise, merge } from 'most'

import StateContainer from './StateContainer'
import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = props => component => {
    const search$ = component.observe('search')

    const suggestions$ = search$
        .filter(Boolean)
        .debounce(200)
        .map(search =>
            fromPromise(
                fetch(
                    `https://api.github.com/search/users?q=${search}&sort=followers`
                )
            )
        )
        .switchLatest()
        .map(res => res.json())
        .awaitPromises()
        .map(({ items = [] }) => items.slice(0, 10))
        .map(suggestions => ({ suggestions }))
        .map(toState)

    const clearSuggestions$ = search$
        .filter(search => search === '')
        .map(() => ({ suggestions: [] }))
        .map(toState)

    const user$ = component
        .observe('selection')
        .filter(Boolean)
        .debounce(200)
        .map(selection =>
            fromPromise(fetch(`https://api.github.com/users/${selection}`))
        )
        .switchLatest()
        .map(res => res.json())
        .awaitPromises()
        .map(user => ({ user }))
        .map(toState)

    return merge(suggestions$, clearSuggestions$, user$)
}

const handler = ({ setState }) => effect => {
    switch (effect.type) {
        case 'SET_STATE':
            return setState(effect.payload)

        default:
            return
    }
}
const errorHandler = () => err => console.error(err)

const LayoutWithEffects = withEffects(handler, errorHandler)(aperture)(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
