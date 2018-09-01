import React from 'react'

const Layout = ({ count, direction, setDirection }) => (
    <div>
        <p>Current count: {count}</p>
        <p>Current direction: {direction}</p>
        <p>
            <button
                className={direction === 'INCREASE' && 'active'}
                onClick={() => setDirection('INCREASE')}
            >
                Increase
            </button>
            <button
                className={direction === 'NONE' && 'active'}
                onClick={() => setDirection('NONE')}
            >
                Pause
            </button>
            <button
                className={direction === 'DECREASE' && 'active'}
                onClick={() => setDirection('DECREASE')}
            >
                Decrease
            </button>
        </p>
    </div>
)

export default Layout
