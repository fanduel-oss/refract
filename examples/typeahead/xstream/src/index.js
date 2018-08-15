import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-xstream'
import withState from 'react-state-hoc'
import xs from 'xstream'
import debounce from 'xstream/extra/debounce'

import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = intialProps => component => {
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

const handler = initialProps => effect => {
    if (effect.type === 'SET_STATE') {
        initialProps.setState(effect.payload)
    }
}
const errorHandler = () => err => console.error(err)

const initialState = { search: '', selection: '', sugestions: [], user: null }

const AppWithEffects = withState(initialState)(
    withEffects(handler, errorHandler)(aperture)(Layout)
)

render(<AppWithEffects />, document.getElementById('root'))
