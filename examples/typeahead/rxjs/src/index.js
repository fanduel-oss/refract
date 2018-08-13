import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-rxjs'
import withState from 'react-state-hoc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { timer } from 'rxjs/observable/timer'

import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = intialProps => component => {
    const search$ = component.observe('search')

    const suggestions$ = search$.pipe(
        filter(Boolean),
        debounce(() => timer(200)),
        flatMap(search =>
            fromPromise(
                fetch(
                    `https://api.github.com/search/users?q=${search}&sort=followers`
                ).then(res => res.json())
            )
        ),
        map(({ items = [] }) => items.slice(0, 10)),
        map(suggestions => ({ suggestions })),
        map(toState)
    )

    const clearSuggestions$ = search$.pipe(
        filter(search => search === ''),
        map(() => ({ suggestions: [] })),
        map(toState)
    )

    const user$ = component
        .observe('selection')
        .pipe(
            filter(Boolean),
            debounce(() => timer(200)),
            flatMap(selection =>
                fromPromise(
                    fetch(`https://api.github.com/users/${selection}`).then(
                        res => res.json()
                    )
                )
            ),
            map(user => ({ user })),
            map(toState)
        )

    return merge(suggestions$, clearSuggestions$, user$)
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
