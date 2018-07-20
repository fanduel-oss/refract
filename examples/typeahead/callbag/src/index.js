import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-callbag'
import withState from 'react-state-hoc'
import fromPromise from 'callbag-from-promise'
import { debounce } from 'callbag-debounce'
import { filter, flatten, map, merge, pipe } from 'callbag-basics'

import Layout from './Layout'

const aperture = intialProps => component => {
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
        map(({ items = [] }) => items),
        map(payload => ({ type: 'USER_SUGGESTIONS_RECEIVE', payload }))
    )

    const clearSuggestions$ = pipe(
        search$,
        filter(search => search === ''),
        map(() => ({
            type: 'USER_SUGGESTIONS_CLEAR'
        }))
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
        map(payload => ({ type: 'USER_RECEIVE', payload }))
    )

    return merge(suggestions$, clearSuggestions$, user$)
}

const handler = initialProps => effect => {
    if (effect.type === 'USER_SUGGESTIONS_CLEAR') {
        initialProps.setState({ suggestions: [] })
    }

    if (effect.type === 'USER_SUGGESTIONS_RECEIVE') {
        initialProps.setState({ suggestions: effect.payload.slice(0, 10) })
    }

    if (effect.type === 'USER_RECEIVE') {
        initialProps.setState({ user: effect.payload })
    }
}
const errorHandler = () => err => console.error(err)

const initialState = { search: '', selection: '', sugestions: [], user: null }

const AppWithEffects = withState(initialState)(
    withEffects(handler, errorHandler)(aperture)(Layout)
)

render(<AppWithEffects />, document.getElementById('root'))
