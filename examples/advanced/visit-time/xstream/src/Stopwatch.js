import React from 'react'

const timeToStopWatch = timestamp => {
    const milliseconds = timestamp.toString().slice(-3)
    const hours = Math.floor(timestamp / 3600000)
    const minutes = Math.floor((timestamp - hours * 3600000) / 60000)
    const seconds = Math.floor((timestamp - minutes * 60000) / 1000)

    return {
        hours,
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        milliseconds: milliseconds.padStart(3, '0')
    }
}

function Stopwatch({ timestamp }) {
    const { hours, minutes, seconds, milliseconds } = timeToStopWatch(timestamp)

    return (
        <div styles="font-variant-numeric: tabular-nums;">
            {hours} : {minutes} : {seconds} : {milliseconds}
        </div>
    )
}

export default Stopwatch
