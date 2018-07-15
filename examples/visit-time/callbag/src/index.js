import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects, compose } from 'refract-callbag'
import { merge, combine, fromEvent, pipe, map, flatten } from 'callbag-basics'
import startWith from 'callbag-start-with'
import CbOf from 'callbag-of'
import interval from 'callbag-interval'
import dropRepeats from 'callbag-drop-repeats'

import App from './App'

const isVisible = () => document.visibilityState === 'visible'
const isOnline = () => window.navigator.onLine

const aperture = () => component => {
    const visible$ = pipe(
        fromEvent(document, 'visibilitychange'),
        map(isVisible),
        startWith(isVisible())
    )
    const online$ = pipe(
        merge(
            pipe(fromEvent(window, 'online'), map(() => true)),
            pipe(fromEvent(window, 'offline'), map(() => false))
        ),
        startWith(isOnline())
    )

    return pipe(
        combine(online$, visible$),
        map(([online, visible]) => online && visible),
        dropRepeats(),
        map(
            onlineAndVisible =>
                onlineAndVisible
                    ? pipe(
                          interval(10),
                          map(() => ({
                              type: 'TICK'
                          })),
                          startWith({ type: 'RESUME' })
                      )
                    : CbOf({ type: 'PAUSE' })
        ),
        flatten
    )
}

const handler = ({ resume, pause, tick }) => effect => {
    if (effect.type === 'RESUME') {
        resume(Date.now())
    } else if (effect.type === 'PAUSE') {
        pause(Date.now())
    } else if (effect.type === 'TICK') {
        tick(Date.now())
    }
}
const errorHandler = () => err => console.error(err)

const initialState = { lastResumeTimestamp: null, totalTime: 0, runningTime: 0 }

const mapSetStateToProps = {
    resume: timestamp => ({
        lastResumeTimestamp: timestamp,
        runningTime: 0
    }),
    tick: timestamp => prevState =>
        console.log(prevState) || {
            runningTime: timestamp - prevState.lastResumeTimestamp
        },
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
