import React from 'react'

const Layout = ({ count, direction, setDirection }) => (
    <div>
        <p>Current count: {count}</p>
        <p>Current direction: {direction}</p>
        <p>
            <button onClick={() => setDirection('INCREASE')}>Increase</button>
            <button onClick={() => setDirection('NONE')}>Pause</button>
            <button onClick={() => setDirection('DECREASE')}>Decrease</button>
        </p>
    </div>
)

export default Layout
