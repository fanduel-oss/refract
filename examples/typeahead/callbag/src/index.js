import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-callbag'
import fromPromise from 'callbag-from-promise'
import { debounce } from 'callbag-debounce'
import { filter, flatten, map, merge, pipe } from 'callbag-basics'

import StateContainer from './StateContainer'
import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = component => {
    const search$ = component.observe('search')

    const suggestions$ = pipe(
        search$,
        filter(Boolean),
        debounce(200),
        map(search =>
            fromPromise(
                fetch(
                    `https://api.github.com/search/users?q=${search}&sort=followers`
                ).then(res => res.json())
            )
        ),
        flatten,
        map(({ items = [] }) => items.slice(0, 10)),
        map(suggestions => ({ suggestions })),
        map(toState)
    )

    const clearSuggestions$ = pipe(
        search$,
        filter(search => search === ''),
        map(() => ({ suggestions: [] })),
        map(toState)
    )

    const user$ = pipe(
        component.observe('selection'),
        filter(Boolean),
        debounce(200),
        map(selection =>
            fromPromise(
                fetch(`https://api.github.com/users/${selection}`).then(res =>
                    res.json()
                )
            )
        ),
        flatten,
        map(user => ({ user })),
        map(toState)
    )

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

const LayoutWithEffects = withEffects(aperture, { handler, errorHandler })(
    Layout
)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
