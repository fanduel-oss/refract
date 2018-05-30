import React from 'react'

const User = ({ avatar_url, bio, html_url, login, name }) => (
    <a href={html_url} target="_blank" className="card">
        <img src={avatar_url} alt={name} className="avatar" />
        <h4>{name || login}</h4>
        {bio && <p>{bio}</p>}
    </a>
)

const Layout = ({ data, setUsername, username }) => (
    <div>
        <input
            placeholder="Enter a GitHub username..."
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
        {data && (data.message ? <p>{data.message}</p> : <User {...data} />)}
    </div>
)

export default Layout
