import React from 'react'
import { render } from 'react-dom'

import { withEffects } from 'refract-rxjs'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { of } from 'rxjs/observable/of'
import { merge } from 'rxjs/observable/merge'
import { map } from 'rxjs/operators'

import StateContainer from './StateContainer'
import Layout from './Layout'

const aperture = (component, initialProps) => {
    const activeTab$ = component.observe('setActiveTab')

    return merge(
        of({
            type: 'NAVIGATION',
            replace: true,
            state: initialProps.activeTab
        }),

        activeTab$.pipe(
            map(activeTab => ({
                type: 'NAVIGATION',
                replace: false,
                state: activeTab
            }))
        ),

        fromEvent(window, 'popstate').pipe(
            map(evt => ({
                type: 'STATE',
                state: evt.state || null
            }))
        )
    )
}

const handler = ({ setActiveTab }) => effect => {
    switch (effect.type) {
        case 'NAVIGATION':
            const path = document.location.pathname
            const search = effect.state
                ? `?tab=${effect.state}`
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
