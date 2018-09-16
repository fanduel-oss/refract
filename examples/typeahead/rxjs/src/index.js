import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { debounce, filter, flatMap, map } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { timer } from 'rxjs/observable/timer'

import StateContainer from './StateContainer'
import Layout from './Layout'

const toState = payload => ({ type: 'SET_STATE', payload })

const aperture = props => component => {
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
