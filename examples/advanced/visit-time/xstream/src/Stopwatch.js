import React from 'react'

function Stopwatch({ lastResumeTimestamp, totalTime, runningTime }) {
    return (
        <div>
            Total time(ms):{' '}
            {lastResumeTimestamp ? totalTime + runningTime : totalTime}
            <br />
            Running time(ms): {runningTime}
        </div>
    )
}

export default Stopwatch
