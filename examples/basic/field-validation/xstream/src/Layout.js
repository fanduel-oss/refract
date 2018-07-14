import React from 'react'

const Status = ({ available }) => (
    <p className={available ? 'success' : 'error'} style={{ marginTop: 0 }}>
        <em>Username {available ? 'available' : 'unavailable'}!</em>
    </p>
)

const Layout = ({ available, setUsername, username }) => (
    <div>
        <h1>Sign up to GitHub!</h1>
        <p>Choose a username:</p>
        <p>
            <input
                placeholder="Type your desired username here..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={available === 'false' ? 'error' : ''}
            />
        </p>
        {available ? <Status available={available === 'true'} /> : null}
    </div>
)

export default Layout
