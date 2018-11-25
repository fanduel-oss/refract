import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'

import { withEffects, compose } from 'refract-most'
import { combine, merge, fromEvent, of as MostOf, periodic } from 'most'

import App from './App'

const isVisible = () => document.visibilityState === 'visible'
const isOnline = () => window.navigator.onLine

const aperture = () => {
    const visible$ = fromEvent('visibilitychange', document)
        .map(isVisible)
        .startWith(isVisible())
    const online$ = merge(
        fromEvent('online', window).map(() => true),
        fromEvent('offline', window).map(() => false)
    ).startWith(isOnline())

    return combine((online, visible) => online && visible, online$, visible$)
        .skipRepeats()
        .map(
            onlineAndVisible =>
                onlineAndVisible
                    ? periodic(10)
                          .map(() => ({
                              type: 'TICK'
                          }))
                          .startWith({ type: 'RESUME' })
                    : MostOf({ type: 'PAUSE' })
        )
        .switchLatest()
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
    withEffects(aperture, { handler, errorHandler })
)(App)

render(<AppWithEffects />, document.getElementById('root'))
