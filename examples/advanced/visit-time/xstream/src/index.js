import React from 'react'
import { render } from 'react-dom'
import withState from 'react-state-hoc'
import { withEffects } from 'refract-xstream'
import xs from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

import Stopwatch from './Stopwatch'

const handler = ({ resume, pause, tick }) => effect => {
    if (effect.type === 'RESUME') {
        resume(Date.now())
    } else if (effect.type === 'PAUSE') {
        pause(Date.now())
    } else if (effect.type === 'TICK') {
        tick(Date.now())
    }
}

const isVisible = () => document.visibilityState === 'visible'

const aperture = () => component => {
    const visible$ = fromEvent(document, 'visibilitychange')
        .map(isVisible)
        .startWith(isVisible())
    const online$ = xs
        .merge(
            fromEvent(window, 'online').mapTo(true),
            fromEvent(window, 'offline').mapTo(false)
        )
        .startWith(window.navigator.onLine)

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
            prevState.totalTime + timestamp - prevState.lastResumeTimestamp
    })
}

const App = withState(initialState, mapSetStateToProps)(
    withEffects(handler, () => err => console.err(err))(aperture)(Stopwatch)
)

render(<App />, document.getElementById('root'))
