import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-callbag'
import { fromEvent, map, merge, pipe } from 'callbag-basics'
import of from 'callbag-of'

import StateContainer from './StateContainer'
import Layout from './Layout'

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

const handler = ({ setState }) => effect => {
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
            return setState(effect.state)

        default:
            return
    }
}

const LayoutWithEffects = withEffects(handler)(aperture)(Layout)

const App = () => (
    <StateContainer>{state => <LayoutWithEffects {...state} />}</StateContainer>
)

render(<App />, document.getElementById('root'))
