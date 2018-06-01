import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-most'
import { fromEvent, merge, just } from 'most'
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
        just({
            type: 'NAVIGATION',
            replace: true,
            state: { activeTab: initialProps.activeTab }
        }),

        activeTab$.map(activeTab => ({
            type: 'NAVIGATION',
            replace: false,
            state: { activeTab }
        })),

        fromEvent('popstate', window).map(evt => ({
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
