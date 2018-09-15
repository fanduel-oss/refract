import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from './store'

import Search from './Search'
import Users from './Users'

const Layout = ({ requestUser }) => (
    <div>
        <Search
            placeholder="Enter a GitHub username..."
            onSubmit={requestUser}
        />
        <Users />
    </div>
)

export default connect(null, {
    requestUser: actionCreators.requestUser
})(Layout)
