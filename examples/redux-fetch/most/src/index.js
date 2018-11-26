import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { withEffects } from 'refract-most'
import { combine, fromPromise, merge } from 'most'

import Layout from './Layout'
import { actionCreators, actionTypes, selectors } from './store'
import store from './setupStore'

const aperture = (component, { store }) => {
    const combined$ = combine(
        (x, y) => [x, y],
        store.observe(actionTypes.USER_REQUEST),
        store.observe(selectors.getUsers)
    )

    const requestUser$ = combined$
        .filter(([request, users]) => !Boolean(users[request.payload]))
        .map(([{ payload: username }]) =>
            fromPromise(
                fetch(`https://api.github.com/users/${username}`).then(res =>
                    res.json()
                )
            )
        )
        .switchLatest()
        .map(
            ({ message, ...response }) =>
                Boolean(message)
                    ? actionCreators.receiveError(message)
                    : actionCreators.receiveUser(response)
        )

    const selectUser$ = combined$
        .filter(([request, users]) => Boolean(users[request.payload]))
        .map(([{ payload }]) => payload)
        .map(actionCreators.selectUser)

    return merge(requestUser$, selectUser$)
}

const handler = ({ store }) => effect => {
    switch (effect.type) {
        case actionTypes.ERROR_RECEIVE:
            return console.log(effect)

        case actionTypes.USER_RECEIVE:
            return store.dispatch(effect)

        case actionTypes.USER_SELECT:
            return store.dispatch(effect)

        default:
            return
    }
}

const App = withEffects(aperture, { handler })(Layout)

render(
    <Provider store={store}>
        <App store={store} />
    </Provider>,
    document.getElementById('root')
)
