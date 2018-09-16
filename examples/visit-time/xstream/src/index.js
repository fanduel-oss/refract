import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'

import { withEffects, compose } from 'refract-xstream'
import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

import App from './App'

const isVisible = () => document.visibilityState === 'visible'
const isOnline = () => window.navigator.onLine

const aperture = () => component => {
    const visible$ = fromEvent(document, 'visibilitychange')
        .map(isVisible)
        .startWith(isVisible())
    const online$ = xs
        .merge(
            fromEvent(window, 'online').mapTo(true),
            fromEvent(window, 'offline').mapTo(false)
        )
        .startWith(isOnline())

    return xs
        .combine(online$, visible$)
        .map(([online, visible]) => online && visible)
        .compose(dropRepeats())
        .map(
            onlineAndVisible =>
                onlineAndVisible
                    ? xs
                          .periodic(10)
                          .mapTo({
                              type: 'TICK'
                          })
                          .startWith({ type: 'RESUME' })
                    : xs.of({ type: 'PAUSE' })
        )
        .flatten()
}

const handler = ({ resume, pause, tick }) => effect => {
    switch (effect.type) {
        case 'RESUME':
            return resume(Date.now())

        case 'PAUSE':
            return pause(Date.now())

        case 'TICK':
            return tick(Date.now())

        default:
            return
    }
}
const errorHandler = () => err => console.error(err)

const initialState = { lastResumeTimestamp: null, totalTime: 0, runningTime: 0 }

const mapSetStateToProps = {
    resume: timestamp => ({
        lastResumeTimestamp: timestamp,
        runningTime: 0
    }),
    tick: timestamp => prevState => ({
        runningTime: timestamp - prevState.lastResumeTimestamp
    }),
    pause: timestamp => prevState => ({
        lastResumeTimestamp: null,
        totalTime:
            prevState.totalTime + timestamp - prevState.lastResumeTimestamp,
        runningTime: timestamp - prevState.lastResumeTimestamp
    })
}

const AppWithEffects = compose(
    withState(initialState, mapSetStateToProps),
    withEffects(handler, errorHandler)(aperture)
)(App)

render(<AppWithEffects />, document.getElementById('root'))
