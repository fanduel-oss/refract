import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-xstream'
import fromEvent from 'xstream/extra/fromEvent'
import withState from 'react-state-hoc'
import xs from 'xstream'

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

    return xs.merge(
        xs.of({
            type: 'NAVIGATION',
            replace: true,
            state: { activeTab: initialProps.activeTab }
        }),

        activeTab$.map(activeTab => ({
            type: 'NAVIGATION',
            replace: false,
            state: { activeTab }
        })),

        fromEvent(window, 'popstate').map(evt => ({
            type: 'STATE',
            state: evt.state || { activeTab: null }
        }))
    )
}

const initialState = { activeTab: null }

const mapSetStateToProps = { setActiveTab: activeTab => ({ activeTab }) }

const App = withState(initialState, mapSetStateToProps)(
    withEffects(effectHandler)(effectFactory)(Layout)
)

render(<App />, document.getElementById('root'))
