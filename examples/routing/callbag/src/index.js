import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-callbag'
import { fromEvent, map, merge, pipe } from 'callbag-basics'
import of from 'callbag-of'
import withState from 'react-state-hoc'

import Layout from './Layout'

const handler = ({ setState }) => (effect = {}) => {
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

const aperture = initialProps => component => {
    const activeTab$ = component.observe('setActiveTab')

    return merge(
        of({
            type: 'NAVIGATION',
            replace: true,
            state: { activeTab: initialProps.activeTab }
        }),

        pipe(
            activeTab$,
            map(activeTab => ({
                type: 'NAVIGATION',
                replace: false,
                state: { activeTab }
            }))
        ),

        pipe(
            fromEvent(window, 'popstate'),
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
    withEffects(handler)(aperture)(Layout)
)

render(<App />, document.getElementById('root'))
