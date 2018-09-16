import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-xstream'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import StateContainer from './StateContainer'
import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = props => component => {
    const search$ = component.observe('search')

    const suggestions$ = search$
        .filter(Boolean)
        .compose(debounce(200))
        .map(search =>
            xs.fromPromise(
                fetch(
                    `https://api.github.com/search/users?q=${search}&sort=followers`
                ).then(res => res.json())
            )
        )
        .flatten()
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
        .compose(debounce(200))
        .map(selection =>
            xs.fromPromise(
                fetch(`https://api.github.com/users/${selection}`).then(res =>
                    res.json()
                )
            )
        )
        .flatten()
        .map(user => ({ user }))
        .map(toState)

    return xs.merge(suggestions$, clearSuggestions$, user$)
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
