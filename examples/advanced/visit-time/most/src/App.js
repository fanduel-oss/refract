import React from 'react'
import Stopwatch from './Stopwatch'

function App({ lastResumeTimestamp, totalTime, runningTime }) {
    return (
        <div>
            <h1>Time spent on this page online and visible</h1>
            <p>
                This example tracks the time spent on this page while it is
                visible (tab is selected) and online. Switch tab or toggle your
                connectivity (using dev tools) and observe the timers pausing
                and resuming!
            </p>

            <strong>Total time(ms)</strong>
            <Stopwatch
                timestamp={
                    lastResumeTimestamp ? totalTime + runningTime : totalTime
                }
            />

            <br />

            <strong>Running time(ms)</strong>
            <Stopwatch timestamp={runningTime} />
        </div>
    )
}

export default App
