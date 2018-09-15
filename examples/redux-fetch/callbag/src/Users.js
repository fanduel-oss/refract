import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { actionCreators, selectors } from './store'

const UserLink = ({ active, login, name, selectUser }) => (
    <button className={active ? 'active' : ''} onClick={selectUser}>
        {name || login}
    </button>
)

const User = ({ avatar_url, bio, html_url, login, name }) => (
    <a href={html_url} target="_blank" className="card">
        <img src={avatar_url} alt={name} className="avatar" />
        <h4>{name || login}</h4>
        {bio && <p>{bio}</p>}
    </a>
)

const Users = ({ active, selectUser, users }) => {
    const userLinks = Object.values(users).map(user => (
        <UserLink
            key={user.login}
            selectUser={() => selectUser(user.login)}
            active={active === user.login}
            {...user}
        />
    ))
    return (
        <Fragment>
            <p>
                {userLinks.length
                    ? userLinks
                    : 'Search for a user to see their details!'}
            </p>
            {active ? <User {...users[active]} /> : null}
        </Fragment>
    )
}

const mapStateToProps = state => ({
    active: selectors.getActive(state),
    users: selectors.getUsers(state)
})
const mapDispatchToProps = {
    selectUser: actionCreators.selectUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
