import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { withEffects } from 'refract-most'
import { combine, fromPromise, merge } from 'most'

import Layout from './Layout'
import { actionCreators, actionTypes, selectors } from './store'
import store from './setupStore'

const effectHandler = ({ store }) => effect => {
    console.log(effect)
    // if (effect.type === actionTypes.ERROR_RECEIVE) {
    //     console.log(effect)
    // }

    // if (effect.type === actionTypes.USER_RECEIVE) {
    //     store.dispatch(effect)
    // }

    // if (effect.type === actionTypes.USER_SELECT) {
    //     store.dispatch(effect)
    // }
}

const effectFactory = ({ store }) => () => {
    const combined$ = combine(
        store.observe(actionTypes.USER_REQUEST),
        store.observe(selectors.getUsers)
    )

    return combined$

    // const requestUser$ = combined$
    //     .filter(([request, users]) => !Boolean(users[request.payload]))
    //     .map(([{ payload: username }]) =>
    //         fromPromise(
    //             fetch(`https://api.github.com/users/${username}`).then(res =>
    //                 res.json()
    //             )
    //         )
    //     )
    //     .flatten.map(
    //         ({ message, ...response }) =>
    //             Boolean(message)
    //                 ? actionCreators.receiveError(message)
    //                 : actionCreators.receiveUser(response)
    //     )

    // const selectUser$ = combined$
    //     .filter(([request, users]) => Boolean(users[request.payload]))
    //     .map(([{ payload }]) => payload)
    //     .map(actionCreators.selectUser)

    // return merge(requestUser$, selectUser$)
}

const App = withEffects(effectHandler)(effectFactory)(Layout)

render(
    <Provider store={store}>
        <App store={store} />
    </Provider>,
    document.getElementById('root')
)
