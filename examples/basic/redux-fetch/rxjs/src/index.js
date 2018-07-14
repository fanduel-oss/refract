import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { withEffects } from 'refract-rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { merge } from 'rxjs/observable/merge'
import { fromPromise } from 'rxjs/observable/fromPromise'

import Layout from './Layout'
import { actionCreators, actionTypes, selectors } from './store'
import store from './setupStore'

const handler = ({ store }) => effect => {
    if (effect.type === actionTypes.ERROR_RECEIVE) {
        console.log(effect)
    }

    if (effect.type === actionTypes.USER_RECEIVE) {
        store.dispatch(effect)
    }

    if (effect.type === actionTypes.USER_SELECT) {
        store.dispatch(effect)
    }
}

const aperture = ({ store }) => () => {
    const combined$ = combineLatest(
        store.observe(actionTypes.USER_REQUEST),
        store.observe(selectors.getUsers)
    )

    const requestUser$ = combined$.pipe(
        filter(([request, users]) => !Boolean(users[request.payload])),
        mergeMap(([{ payload: username }]) =>
            fromPromise(
                fetch(`https://api.github.com/users/${username}`).then(res =>
                    res.json()
                )
            )
        ),
        map(
            ({ message, ...response }) =>
                Boolean(message)
                    ? actionCreators.receiveError(message)
                    : actionCreators.receiveUser(response)
        )
    )

    const selectUser$ = combined$.pipe(
        filter(([request, users]) => Boolean(users[request.payload])),
        map(([{ payload }]) => payload),
        map(actionCreators.selectUser)
    )

    return merge(requestUser$, selectUser$)
}

const App = withEffects(handler)(aperture)(Layout)

render(
    <Provider store={store}>
        <App store={store} />
    </Provider>,
    document.getElementById('root')
)
