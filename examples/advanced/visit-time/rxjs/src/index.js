import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects, compose } from 'refract-rxjs'
import { fromEvent, merge, combineLatest, interval, of as RxOf } from 'rxjs'
import {
    map,
    startWith,
    switchMap,
    distinctUntilChanged,
    mapTo
} from 'rxjs/operators'

import App from './App'

const isVisible = () => document.visibilityState === 'visible'
const isOnline = () => window.navigator.onLine

const aperture = () => component => {
    const visible$ = fromEvent(document, 'visibilitychange').pipe(
        map(isVisible),
        startWith(isVisible())
    )

    const online$ = merge(
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
    ).pipe(startWith(isOnline()))

    return combineLatest(online$, visible$).pipe(
        map(([online, visible]) => online && visible),
        distinctUntilChanged(),
        switchMap(
            onlineAndVisible =>
                onlineAndVisible
                    ? interval(10).pipe(
                          mapTo({
                              type: 'TICK'
                          }),
                          startWith({ type: 'RESUME' })
                      )
                    : RxOf({ type: 'PAUSE' })
        )
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
