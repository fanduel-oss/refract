import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-rxjs'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { merge } from 'rxjs/observable/merge'
import { map } from 'rxjs/operators'
import withState from 'react-state-hoc'

import Layout from './Layout'

const effectHandler = ({ setState }) => (effect = {}) => {
    if (effect.type === 'NAVIGATION') {
        const path = document.location.pathname
        const search = effect.state.activeTab
            ? `?tab=${effect.state.activeTab}`
            : ''
        const methodName = effect.replace ? 'replaceState' : 'pushState'
        window.history[methodName](effect.state, null, `${path}${search}`)
    }

    if (effect.type === 'STATE') {
        setState(effect.state)
    }
}

const effectFactory = initialProps => component => {
    const activeTab$ = component.observe('setActiveTab')

    return merge(
        of({
            type: 'NAVIGATION',
            replace: true,
            state: { activeTab: initialProps.activeTab }
        }),

        activeTab$.pipe(
            map(activeTab => ({
                type: 'NAVIGATION',
                replace: false,
                state: { activeTab }
            }))
        ),

        fromEvent(window, 'popstate').pipe(
            map(evt => ({
                type: 'STATE',
                state: evt.state || { activeTab: null }
            }))
        )
    )
}

const initialState = { activeTab: null }

const mapSetStateToProps = { setActiveTab: activeTab => ({ activeTab }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(effectHandler)(effectFactory)(Layout)
)

render(<App />, document.getElementById('root'))
