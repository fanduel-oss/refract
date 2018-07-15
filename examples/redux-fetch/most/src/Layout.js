import React from 'react'
import withState from 'react-state-hoc'
import { connect } from 'react-redux'
import { actionCreators } from './store'

import Users from './Users'

const Layout = ({ setUsername, username, requestUser }) => (
    <div>
        <form
            className="inline"
            onSubmit={e => {
                e.preventDefault()
                requestUser(username)
            }}
        >
            <input
                placeholder="Enter a GitHub username..."
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <button type="submit">Search!</button>
        </form>
        <Users />
    </div>
)

const mapDispatchToProps = {
    requestUser: actionCreators.requestUser
}

const initialState = { data: null, username: '' }

const mapSetStateToProps = { setUsername: username => ({ username }) }

export default connect(null, mapDispatchToProps)(
    withState(initialState, mapSetStateToProps)(Layout)
)
