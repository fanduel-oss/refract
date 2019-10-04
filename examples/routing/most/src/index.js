import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-most'
import { fromEvent, merge, just } from 'most'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = (component, initialProps) => {
    const activeTab$ = component.observe('setActiveTab')

    return merge(
        just({
            type: 'NAVIGATION',
            replace: true,
            state: initialProps.activeTab
        }),

        activeTab$.map(activeTab => ({
            type: 'NAVIGATION',
            replace: false,
            state: activeTab
        })),

        fromEvent('popstate', window).map(evt => ({
            type: 'STATE',
            state: evt.state || null
        }))
    )
}

const handler = ({ setActiveTab }) => effect => {
    switch (effect.type) {
        case 'NAVIGATION':
            const path = document.location.pathname
            const search = effect.state.activeTab
                ? `?tab=${effect.state.activeTab}`
                : ''
            const methodName = effect.replace ? 'replaceState' : 'pushState'
            window.history[methodName](effect.state, null, `${path}${search}`)
            return

        case 'STATE':
            return setActiveTab(effect.state)

        default:
            return
    }
}

const LayoutWithEffects = withEffects(aperture, { handler })(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
