import React from 'react'

const User = ({ avatar_url, bio, html_url, login, name }) => (
    <a href={html_url} target="_blank" className="card">
        <img src={avatar_url} alt={name} className="avatar" />
        <h4>{name || login}</h4>
        {bio && <p>{bio}</p>}
    </a>
)

const ifReturn = callback => e => (e.keyCode === 13 ? callback() : undefined)

const Suggestion = ({ login, name, select }) => (
    <li
        key={login}
        onClick={select}
        onKeyDown={ifReturn(() => select())}
        tabIndex="0"
    >
        {name || login}
    </li>
)

const Layout = ({ search, selection, setState, suggestions, user }) => {
    const content = selection ? (
        <User {...user} />
    ) : (
        suggestions && (
            <ul className="options">
                {suggestions.map(user => (
                    <Suggestion
                        key={user.login}
                        {...user}
                        select={() =>
                            setState({
                                search: user.login,
                                selection: user.login,
                                user: null
                            })
                        }
                    />
                ))}
            </ul>
        )
    )

    return (
        <div className="form">
            <input
                onChange={e =>
                    setState({ search: e.target.value, selection: '' })
                }
                onKeyDown={ifReturn(() =>
                    setState({ selection: search, user: null })
                )}
                placeholder="Enter a GitHub username..."
                tabIndex="0"
                value={search}
            />
            {content}
        </div>
    )
}

export default Layout
